export function setupProjectModal(projects) {
  const grid = document.querySelector('.conteneur-projets');
  const modal = document.querySelector('#conteneur-modale');
  const modalBody = document.querySelector('#corps-modale');
  const closeButton = document.querySelector('#fermer-modale');

  if (!grid || !modal || !modalBody || !closeButton) {
    return;
  }

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('modale-active');
  };

  const openModal = (project) => {
    modalBody.innerHTML = `
			<h2 id="titre-modale">${project.name}</h2>
			<p>${project.description}</p>
			${project.video ? `<a href="${project.video}" target="_blank" rel="noopener noreferrer">Voir la vidéo</a>` : ''}
			${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer">Visiter le site</a>` : ''}
		`;
    modal.hidden = false;
    document.body.classList.add('modale-active');
    closeButton.focus();
  };

  const selectProject = (card) => {
    const project = projects.find((item) => item.id === card.dataset.projectId);

    if (project) {
      openModal(project);
    }
  };

  grid.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      return;
    }

    const card = event.target.closest('.carte-projet');

    if (card) {
      selectProject(card);
    }
  });

  grid.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    const card = event.target.closest('.carte-projet');

    if (card) {
      event.preventDefault();
      selectProject(card);
    }
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}
