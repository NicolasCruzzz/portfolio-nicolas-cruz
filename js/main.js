import { loadProjects } from './data.js';
import { createProjectCard } from './composants/carte-projet.js';
import { setupProjectModal } from './composants/modale.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  setupDarkMode();
  setupMobileMenu();

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

    setupProjectModal(projects);

    projects.forEach((project) => {
      console.log(project.name);
    });
  } catch (error) {
    console.error(error);
  }
}

function setupMobileMenu() {
  const toggle = document.querySelector('#menu-toggle');
  const nav = toggle?.closest('nav');
  const links = nav?.querySelectorAll('a[href^="#"]');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('menu-ouvert');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute(
      'aria-label',
      isOpen ? 'Fermer le menu' : 'Ouvrir le menu',
    );
  });

  links?.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('menu-ouvert');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Ouvrir le menu');
    });
  });
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
