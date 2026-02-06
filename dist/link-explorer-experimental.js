// Load menu-experimental.html into menu-container
fetch('menu-experimental.html').then(r => r.text()).then(html => {
  document.getElementById('menu-container').innerHTML = html;
});

// Parse link-list.txt and render all records
async function loadLinks() {
  const res = await fetch('link-list.txt');
  const txt = await res.text();
  const records = [];
  let rec = {};
  txt.split('\n').forEach(line => {
    if (line.startsWith('Link: ')) {
      rec.link = line.replace('Link: ', '').trim();
    } else if (line.startsWith('Title: ')) {
      rec.title = line.replace('Title: ', '').trim();
    } else if (line.startsWith('Description: ')) {
      rec.description = line.replace('Description: ', '').trim();
    } else if (line.startsWith('Activities: ')) {
      rec.activities = line.replace('Activities: ', '').trim();
    } else if (line.startsWith('Cause: ')) {
      rec.cause = line.replace('Cause: ', '').trim();
    } else if (line.trim() === '') {
      if ((rec.title || rec.description) && rec.activities && rec.cause) {
        records.push(rec);
      }
      rec = {};
    }
  });
  // Handle last record
  if ((rec.title || rec.description) && rec.activities && rec.cause) {
    records.push(rec);
  }
  return records;
}


function renderLinks(records) {
  const tagList = document.getElementById('tag-list');
  tagList.innerHTML = '';
  records.forEach(rec => {
    const div = document.createElement('div');
    div.className = 'tag-record';
    let titleHtml = rec.link ? `<a href="${rec.link}" target="_blank" class="tag-title" style="color:#2a4d8f;font-size:1.3em;font-weight:700;text-decoration:none;">${rec.title || rec.description}</a>` : `<span class="tag-title" style="color:#2a4d8f;font-size:1.3em;font-weight:700;">${rec.title || rec.description}</span>`;
    let descHtml = rec.description ? `<div class="tag-desc" style="font-size:1.05em;color:#222;margin:0.3em 0 0.5em 0;">${rec.description}</div>` : '';
    let actionsHtml = rec.activities ? `<span class="tag-actions" style="font-size:1.15em;color:#388e3c;font-weight:600;">${rec.activities}</span>` : '';
    let causeHtml = rec.cause ? `<span class="tag-cause" style="background:#e3eafc;color:#2a4d8f;padding:0.15em 0.7em;border-radius:1em;font-size:0.97em;margin-left:0.5em;">${rec.cause}</span>` : '';
    div.innerHTML = `
      <div style="background:#f8fafc;border-radius:14px;padding:1.2em 1.5em;margin:1.2em 0;box-shadow:0 2px 12px #0001;transition:box-shadow 0.2s;">
        ${titleHtml}
        ${descHtml}
        <div style="margin-top:0.5em;display:flex;align-items:center;gap:0.7em;">
          ${actionsHtml} ${causeHtml}
        </div>
      </div>
    `;
    tagList.appendChild(div);
  });
}

function renderGroupedLinks(records, groupBy) {
  const tagList = document.getElementById('tag-list');
  tagList.innerHTML = '';
  // Build group map: groupName -> [records]
  const groupMap = {};
  records.forEach(rec => {
    let groupKeys = [];
    if (groupBy === 'cause') {
      // rec.cause may be comma separated
      groupKeys = rec.cause ? rec.cause.split(',').map(c => c.trim()) : ['Other'];
    } else if (groupBy === 'strategy') {
      groupKeys = rec.activities ? rec.activities.split(',').map(a => a.trim()) : ['Other'];
    }
    if (groupKeys.length === 0) groupKeys = ['Other'];
    groupKeys.forEach(key => {
      if (!groupMap[key]) groupMap[key] = [];
      groupMap[key].push(rec);
    });
  });
  // Render each group
  Object.keys(groupMap).sort().forEach(group => {
    const groupHeader = document.createElement('h3');
    groupHeader.textContent = groupBy.charAt(0).toUpperCase() + groupBy.slice(1) + ': ' + group;
    groupHeader.style.marginTop = '2em';
    tagList.appendChild(groupHeader);
    renderLinks(groupMap[group]);
  });
}

let allRecords = [];
// Determine filter from URL
const params = new URLSearchParams(window.location.search);
const strategy = params.get('strategy');
const cause = params.get('cause');

function renderFilteredLinks(records) {
  let filtered = records;
  if (strategy) {
    filtered = records.filter(rec => {
      if (!rec.activities) return false;
      // Split by comma, trim, and match case-insensitive
      return rec.activities.split(',').map(a => a.trim().toLowerCase()).includes(strategy.toLowerCase());
    });
  } else if (cause) {
    filtered = records.filter(rec => {
      if (!rec.cause) return false;
      return rec.cause.trim().toLowerCase() === cause.toLowerCase();
    });
  }
  renderLinks(filtered);
}


loadLinks().then(records => {
  allRecords = records;
  renderFilteredLinks(allRecords);
});
