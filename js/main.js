import { loadProjects } from './data.js';
import { createProjectCard } from './composants/carte-projet.js';

document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const projects = await loadProjects();
    console.table(projects);

    const grid = document.querySelector('.conteneur-projets');

    if (!grid) {
      throw new Error('Conteneur de projets introuvable.');
    }

    grid.innerHTML = projects.map(project => createProjectCard(project)).join('');

    projects.forEach(project => {
      console.log(project.name);
    });
  } catch (error) {
    console.error(error);
  }
}
