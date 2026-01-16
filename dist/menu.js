// Dynamically loads the menu from menu.html into the element with id="menu-container"
document.addEventListener('DOMContentLoaded', function() {
  console.log('menu.js loaded');
  var container = document.getElementById('menu-container');
  if (container) {
    console.log('menu-container found, loading menu.html...');
    fetch('menu.html')
      .then(response => response.text())
      .then(html => {
        container.innerHTML = html;
        console.log('menu.html loaded and injected');
      });
  } else {
    console.log('menu-container not found');
  }
});
