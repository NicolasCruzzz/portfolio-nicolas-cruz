import { loadProjects } from './data.js';
import { createProjectCard } from './composants/carte-projet.js';
import { setupProjectModal } from './composants/modale.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  setupDarkMode();
  setupMobileMenu();
  setupHomeLink();
  setupSoftwareCarousel();

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

/* Code qui permet de scroll jusqu'au top de la page en cliquant sur le lien "Accueil" */
function setupHomeLink() {
  const homeLink = document.querySelector('a[href="#accueil"]');

  homeLink?.addEventListener('click', (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
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

function setupSoftwareCarousel() {
  const carousel = document.querySelector('.carrousel-logiciels');
  const list = carousel?.querySelector('.liste-logiciels');
  const previousButton = carousel?.querySelector('.fleche-gauche');
  const nextButton = carousel?.querySelector('.fleche-droite');

  if (!carousel || !list || !previousButton || !nextButton) {
    return;
  }

  const updateButtons = () => {
    const maxScrollLeft = list.scrollWidth - list.clientWidth;
    const atStart = list.scrollLeft <= 0;
    const atEnd = list.scrollLeft >= maxScrollLeft - 1;

    previousButton.disabled = atStart;
    nextButton.disabled = atEnd;
  };

  const getScrollDistance = () => {
    const firstItem = list.querySelector('.element-logiciel');

    if (!firstItem) {
      return list.clientWidth;
    }

    const itemWidth = firstItem.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(list).gap || '0');

    return itemWidth + gap;
  };

  previousButton.addEventListener('click', () => {
    list.scrollBy({ left: -getScrollDistance(), behavior: 'smooth' });
  });

  nextButton.addEventListener('click', () => {
    list.scrollBy({ left: getScrollDistance(), behavior: 'smooth' });
  });

  list.addEventListener('scroll', updateButtons);
  window.addEventListener('resize', updateButtons);
  updateButtons();
}
