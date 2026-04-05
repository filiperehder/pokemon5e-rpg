import { state } from '../core/state.js';
import { renderMarkdownText, slugify } from '../core/utils.js';

export function toggleRulesNav() {
  const nav = document.getElementById('rules-nav-tree');
  if (nav) nav.classList.toggle('show-mobile');
}

export function renderRules() {
  const nav = document.getElementById('rules-nav-tree');
  if (!nav || nav.dataset.rendered) return;
  nav.dataset.rendered = '1';

  nav.innerHTML = state.allRules.map((chapter, ci) => `
    <div class="rules-chapter">
      <button class="rules-chapter-btn" id="chapter-btn-${ci}">
        <span>${chapter.title}</span>
        <span class="rules-chapter-arrow">▶</span>
      </button>
      <div class="rules-sections" id="chapter-secs-${ci}">
        ${(chapter.sections || []).map((sec, si) => `
          <button class="rules-section-btn" id="sec-btn-${ci}-${si}">${sec.title}</button>`).join('')}
      </div>
    </div>`).join('');

  // Add click handlers
  nav.querySelectorAll('.rules-chapter-btn').forEach((btn, ci) => {
    btn.onclick = () => toggleChapter(ci);
  });
  nav.querySelectorAll('.rules-section-btn').forEach(btn => {
    const [_, __, ci, si] = btn.id.split('-');
    btn.onclick = () => showRulesSection(parseInt(ci), parseInt(si));
  });

  // Show first chapter by default
  if (state.allRules.length > 0) showRulesChapter(0);
}

export function toggleChapter(ci) {
  const btn = document.getElementById(`chapter-btn-${ci}`);
  const secs = document.getElementById(`chapter-secs-${ci}`);
  const expanded = btn.classList.toggle('expanded');
  btn.classList.toggle('active', expanded);
  secs.classList.toggle('open', expanded);
  if (expanded) showRulesChapter(ci);
}

export function showRulesChapter(ci) {
  const chapter = state.allRules[ci];
  if (!chapter) return;
  state.rulesState.chapterId = ci;

  const content = document.getElementById('rules-content-area');
  if (!content) return;

  // Close nav on mobile
  const nav = document.getElementById('rules-nav-tree');
  if (nav) nav.classList.remove('show-mobile');

  // Build chapter content
  let html = `<h2>${chapter.title}</h2>`;
  if (chapter.intro) html += renderMarkdownContent(chapter.intro);

  (chapter.sections || []).forEach(sec => {
    html += `<h3 id="sec-${slugify(sec.title)}">${sec.title}</h3>`;
    if (sec.content) html += renderMarkdownContent(sec.content);
    (sec.subsections || []).forEach(sub => {
      html += `<h4 style="color:var(--text-primary);font-family:var(--font-heading);font-size:0.9rem;margin-top:16px;margin-bottom:8px">${sub.title}</h4>`;
      if (sub.content) html += renderMarkdownContent(sub.content);
    });
  });

  content.innerHTML = html;
}

export function showRulesSection(ci, si) {
  const chapter = state.allRules[ci];
  const section = chapter?.sections?.[si];
  if (!section) return;

  // Expand chapter nav
  const btn = document.getElementById(`chapter-btn-${ci}`);
  const secs = document.getElementById(`chapter-secs-${ci}`);
  if (btn && secs) {
    btn.classList.add('expanded', 'active');
    secs.classList.add('open');
  }

  // Mark active section
  document.querySelectorAll('.rules-section-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`sec-btn-${ci}-${si}`)?.classList.add('active');

  showRulesChapter(ci);

  // Scroll to section
  setTimeout(() => {
    const el = document.getElementById(`sec-${slugify(section.title)}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

export function renderMarkdownContent(text) {
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let inTable = false;
  let tableRows = [];
  let inList = false;

  function closeList() {
    if (inList) { html += '</ul>'; inList = false; }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') && !trimmed.includes(':---')) {
      closeList();
      if (!inTable) { inTable = true; tableRows = []; }
      tableRows.push(trimmed);
    } else {
      if (inTable) {
        html += renderTable(tableRows);
        inTable = false; tableRows = [];
      }
      if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
        closeList();
        html += `<h4 style="color:var(--text-gold);margin-top:12px;margin-bottom:6px;font-size:0.9rem;font-family:var(--font-heading)">${trimmed.replace(/\*\*/g, '')}</h4>`;
      } else if (trimmed.match(/^[-•*]\s+/)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += `<li>${renderMarkdownText(trimmed.replace(/^[-•*]\s+/, ''))}</li>`;
      } else if (trimmed) {
        closeList();
        html += `<p>${renderMarkdownText(trimmed)}</p>`;
      } else {
        closeList();
      }
    }
  }
  if (inTable) html += renderTable(tableRows);
  closeList();
  return html;
}

export function renderTable(lines) {
  const rows = lines.filter(l => !l.includes(':---'));
  if (rows.length < 2) return '';
  const headers = rows[0].replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  const dataRows = rows.slice(1);
  let html = '<table><thead><tr>';
  headers.forEach(h => { html += `<th>${h}</th>`; });
  html += '</tr></thead><tbody>';
  dataRows.forEach(row => {
    const cells = row.replace(/^\||\|$/g, '').split('|').map(c => c.trim());
    html += '<tr>';
    cells.forEach(c => { html += `<td>${renderMarkdownText(c)}</td>`; });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

export function setupRulesSearch() {
  const search = document.getElementById('search-rules');
  if (!search) return;
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase().trim();
    if (!q) return;

    for (let ci = 0; ci < state.allRules.length; ci++) {
      const ch = state.allRules[ci];
      if (ch.title.toLowerCase().includes(q) || ch.intro?.toLowerCase().includes(q)) {
        showRulesChapter(ci);
        document.getElementById(`chapter-btn-${ci}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
      }
      for (let si = 0; si < (ch.sections || []).length; si++) {
        const sec = ch.sections[si];
        if (sec.title.toLowerCase().includes(q) || sec.content?.toLowerCase().includes(q)) {
          showRulesSection(ci, si);
          return;
        }
      }
    }
  });
}
