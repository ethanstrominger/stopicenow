// title.js
// Dynamically inserts the site title and subtitle at the top of the page


function insertSiteTitle() {
  const container = document.getElementById('site-title-container');
  if (!container) return;
  container.innerHTML = `
    <div style="text-align:center; background:#fff; margin-bottom:0.5em;">
      <h1 style="font-size:2.5em; color:#b30000; font-weight:900; margin-bottom:0.1em; margin-top:0; letter-spacing:0.01em;">FIX ICE</h1>
      <div style="font-size:1.35em; color:#005580; font-weight:600; margin-bottom:0.7em;">Burlington, MA and Beyond</div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', insertSiteTitle);
