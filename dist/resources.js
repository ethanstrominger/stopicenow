// resources.js: Dynamically generate a bulleted list from resources.txt

document.addEventListener('DOMContentLoaded', function() {
  fetch('resources.txt')
    .then(r => r.text())
    .then(text => {
      const container = document.getElementById('resources-list');
      container.innerHTML = '';
      const lines = text.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
      const ul = document.createElement('ul');
      ul.style.listStyle = 'disc outside';
      ul.style.paddingLeft = '0.4em';
      ul.style.margin = '0';
      lines.forEach(line => {
        const parts = line.split('|').map(s => s.trim());
        if (parts.length === 3) {
          const [name, desc, link] = parts;
          const li = document.createElement('li');
          li.style.marginBottom = '0.7em';
          li.style.textIndent = '-0.4em';
          li.style.paddingLeft = '0.4em';
          li.innerHTML = `<a href="${link}" target="_blank">${name}</a> ${desc}`;
          ul.appendChild(li);
        }
      });
      container.appendChild(ul);
    });
});
