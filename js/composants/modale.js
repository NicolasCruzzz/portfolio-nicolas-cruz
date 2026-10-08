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
    const isRoutine = project.id === 'routine-orageuse';
    const media = isRoutine ? [...(project.media || [])] : [];

    if (isRoutine && project.youtube) {
      media.push({ type: 'youtube', src: project.youtube });
    }

    modalBody.innerHTML = `
			<h2 id="titre-modale">${project.name}</h2>
      ${
        isRoutine
          ? `
        <div class="etiquettes-modale">
          ${(project.tags || []).map((tag) => `<span class="etiquette">${tag}</span>`).join('')}
        </div>
        <div class="galerie-modale" aria-live="polite">
          <button class="media-precedent" type="button" aria-label="Média précédent">&lt;</button>
          <div class="media-fenetre"></div>
          <button class="media-suivant" type="button" aria-label="Média suivant">&gt;</button>
        </div>
      `
          : ''
      }
			<p>${project.description}</p>
			${project.video ? `<a href="${project.video}" target="_blank" rel="noopener noreferrer">Voir la vidéo</a>` : ''}
			${project.link ? `<a href="${project.link}" target="_blank" rel="noopener noreferrer">Visiter le site</a>` : ''}
		`;
    modal.hidden = false;
    document.body.classList.add('modale-active');
    closeButton.focus();

    if (isRoutine && media.length > 0) {
      let mediaIndex = 0;
      const mediaWindow = modalBody.querySelector('.media-fenetre');
      const previousButton = modalBody.querySelector('.media-precedent');
      const nextButton = modalBody.querySelector('.media-suivant');
      let touchStartX = 0;

      const renderMedia = () => {
        const currentMedia = media[mediaIndex];
        mediaWindow.innerHTML =
          currentMedia.type === 'youtube'
            ? `<iframe src="${currentMedia.src}" title="Vidéo YouTube de Routine orageuse" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
            : `<img src="${currentMedia}" alt="Média du projet Routine orageuse" />`;
      };

      const showPrevious = () => {
        mediaIndex = (mediaIndex - 1 + media.length) % media.length;
        renderMedia();
      };

      const showNext = () => {
        mediaIndex = (mediaIndex + 1) % media.length;
        renderMedia();
      };

      renderMedia();
      previousButton.addEventListener('click', showPrevious);
      nextButton.addEventListener('click', showNext);
      mediaWindow.addEventListener(
        'touchstart',
        (event) => {
          touchStartX = event.changedTouches[0].clientX;
        },
        { passive: true },
      );
      mediaWindow.addEventListener(
        'touchend',
        (event) => {
          const distance = event.changedTouches[0].clientX - touchStartX;

          if (Math.abs(distance) > 50) {
            distance > 0 ? showPrevious() : showNext();
          }
        },
        { passive: true },
      );
    }
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
