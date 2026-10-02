import { loadProjects } from './data.js';
import { createProjectCard } from './composants/carte-projet.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  setupDarkMode();

  try {
    const projects = await loadProjects();
    console.table(projects);

    const grid = document.querySelector('.conteneur-projets');

    if (!grid) {
      throw new Error('Conteneur de projets introuvable.');
    }

    grid.innerHTML = projects
      .map((project) => createProjectCard(project))
      .join('');

    projects.forEach((project) => {
      console.log(project.name);
    });
  } catch (error) {
    console.error(error);
  }
}

function setupDarkMode() {
  const toggle = document.querySelector('#dark-mode-toggle');
  const darkModeEnabled = localStorage.getItem('dark-mode') === 'true';

  if (!toggle) {
    return;
  }

  applyDarkMode(darkModeEnabled, toggle);

  toggle.addEventListener('click', () => {
    const enabled = !document.body.classList.contains('dark-mode');
    localStorage.setItem('dark-mode', enabled);
    applyDarkMode(enabled, toggle);
  });
}

function applyDarkMode(enabled, toggle) {
  document.body.classList.toggle('dark-mode', enabled);
  toggle.setAttribute('aria-pressed', String(enabled));
  toggle.setAttribute(
    'aria-label',
    enabled ? 'Activer le mode clair' : 'Activer le mode sombre',
  );

  const icon = toggle.querySelector('img');

  if (icon) {
    icon.src = enabled
      ? 'assets/icones/lune_logo_dark.png'
      : 'assets/icones/lune_logo_light.png';
    icon.alt = enabled
      ? 'Icône pour activer le mode clair'
      : 'Icône pour activer le mode sombre';
  }
}
