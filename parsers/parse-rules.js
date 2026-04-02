#!/usr/bin/env node
// Parser for HB-Pokémonin5thEdition.txt → rules.json

const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'HB-Pokémonin5thEdition.txt';
const INPUT = path.join(__dirname, '..', INPUT_FILE);
const OUTPUT = path.join(__dirname, '..', 'public', 'data', 'rules.json');

function cleanMarkdown(text) {
  return text
    .replace(/<[^>]+>/g, '')          // Remove HTML tags
    .replace(/\*\*\*([^*]+)\*\*\*/g, '$1')  // ***text*** → text
    .replace(/\*\*([^*]+)\*\*/g, '$1')       // **text** → text
    .replace(/\*([^*]+)\*/g, '$1')            // *text* → text
    .replace(/^#+\s+/gm, '')           // Remove heading markers
    .replace(/^>\s*/gm, '')            // Remove blockquote markers
    .replace(/^[-_]+$/gm, '')          // Remove horizontal rules
    .replace(/^\|.*\|$/gm, (row) => row)  // Keep table rows as-is for now
    .replace(/\\page/g, '')            // Remove page breaks
    .replace(/```[\s\S]*?```/g, '')    // Remove code blocks
    .replace(/\n{3,}/g, '\n\n')        // Normalize blank lines
    .trim();
}

function parseTable(lines) {
  // Parse markdown table rows
  const rows = [];
  for (const line of lines) {
    if (line.trim().startsWith('|') && !line.includes(':---')) {
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      if (cells.length > 0 && cells.some(c => c)) rows.push(cells);
    }
  }
  if (rows.length < 2) return null;
  const headers = rows[0];
  const data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { if (h) obj[h] = row[i] || ''; });
    return obj;
  });
  return { headers, data };
}

function parseRules(content) {
  const lines = content.split('\n');
  const sections = [];

  let currentChapter = null;
  let currentSection = null;
  let currentSubsection = null;
  let contentBuffer = [];

  function flushContent() {
    const text = contentBuffer.join('\n').replace(/<[^>]+>/g, '').replace(/\\page/g, '').replace(/```[\s\S]*?```/g, '').trim();
    contentBuffer = [];
    return text;
  }

  function saveSubsection() {
    if (!currentSubsection) return;
    const text = flushContent();
    if (currentSection && text) {
      if (!currentSection.subsections) currentSection.subsections = [];
      currentSection.subsections.push({ title: currentSubsection, content: text });
    }
    currentSubsection = null;
  }

  function saveSection() {
    saveSubsection();
    if (!currentSection) return;
    const text = flushContent();
    if (text && !currentSection.content) currentSection.content = text;
    else if (text) currentSection.content = (currentSection.content || '') + '\n\n' + text;
    if (currentChapter) {
      if (!currentChapter.sections) currentChapter.sections = [];
      currentChapter.sections.push(currentSection);
    }
    currentSection = null;
  }

  function saveChapter() {
    saveSection();
    if (!currentChapter) return;
    const text = flushContent();
    if (text) currentChapter.intro = text;
    sections.push(currentChapter);
    currentChapter = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const stripped = line.trim();

    // Skip metadata, style, image tags, and div tags
    if (stripped.startsWith('```metadata') || stripped.startsWith('<style') ||
        stripped.startsWith('<img') || stripped.startsWith('<div') ||
        stripped.startsWith('</div>') || stripped.startsWith('</style>') ||
        stripped === '```' || stripped.startsWith("'") ) {
      // Skip these but don't add to buffer
      continue;
    }

    // H1 = Chapter (# Chapter Title or # 1. Chapter)
    const h1Match = line.match(/^#\s+(?:\d+\.\s+)?(.+)/);
    if (h1Match && !line.match(/^##/)) {
      const title = h1Match[1].replace(/<[^>]+>/g, '').trim();
      if (title && !title.includes('pageNumber') && title.length > 1) {
        saveChapter();
        currentChapter = { id: slugify(title), title, sections: [] };
      }
      continue;
    }

    // H2 = Section (## Section Title)
    const h2Match = line.match(/^##\s+(.+)/);
    if (h2Match) {
      const title = h2Match[1].replace(/<[^>]+>/g, '').trim();
      if (title && !title.includes('pageNumber')) {
        saveSection();
        currentSection = { id: slugify(title), title, content: '', subsections: [] };
      }
      continue;
    }

    // H3 = Subsection
    const h3Match = line.match(/^###\s+(.+)/);
    if (h3Match) {
      const title = h3Match[1].replace(/<[^>]+>/g, '').trim();
      if (title && !title.includes('pageNumber')) {
        saveSubsection();
        currentSubsection = title;
      }
      continue;
    }

    // H4/H5 = Sub-subsection, add as bold to content
    const h4Match = line.match(/^####\s+(.+)/);
    if (h4Match) {
      const title = h4Match[1].replace(/<[^>]+>/g, '').trim();
      if (title) contentBuffer.push('\n**' + title + '**');
      continue;
    }

    // Add regular content lines
    if (!stripped.startsWith('```') && !stripped.startsWith('\\page')) {
      contentBuffer.push(line);
    }
  }

  saveChapter();

  // Post-process: clean content
  for (const chapter of sections) {
    if (chapter.intro) chapter.intro = cleanMarkdown(chapter.intro);
    for (const section of (chapter.sections || [])) {
      if (section.content) section.content = cleanMarkdown(section.content);
      for (const sub of (section.subsections || [])) {
        if (sub.content) sub.content = cleanMarkdown(sub.content);
      }
      // Remove empty subsections
      section.subsections = (section.subsections || []).filter(s => s.content && s.content.trim());
    }
    // Remove empty sections
    chapter.sections = (chapter.sections || []).filter(s => (s.content && s.content.trim()) || (s.subsections && s.subsections.length));
  }

  // Filter out empty chapters and non-content chapters
  return sections.filter(c => c.title && c.title.length > 1 && (c.intro || (c.sections && c.sections.length > 0)));
}

function slugify(str) {
  return str.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-');
}

function main() {
  const raw = fs.readFileSync(INPUT, 'utf-8');
  const rules = parseRules(raw);

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(rules, null, 2), 'utf-8');
  console.log(`Parsed ${rules.length} chapters → ${OUTPUT}`);
  rules.forEach(c => console.log(`  - ${c.title} (${(c.sections || []).length} sections)`));
}

main();
