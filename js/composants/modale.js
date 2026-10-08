export function setupProjectModal(projects) {
  const grid = document.querySelector('.conteneur-projets');
  const modal = document.querySelector('#conteneur-modale');
  const modalBody = document.querySelector('#corps-modale');
  const closeButton = document.querySelector('#fermer-modale');

  const getYoutubeEmbedUrl = (url) => {
    try {
      const parsedUrl = new URL(url);
      const videoId =
        parsedUrl.hostname === 'youtu.be'
          ? parsedUrl.pathname.slice(1)
          : parsedUrl.searchParams.get('v');

      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
      return url;
    }
  };

  if (!grid || !modal || !modalBody || !closeButton) {
    return;
  }

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('modale-active');
  };

  const openModal = (project) => {
    const isRoutine = project.id === 'routine-orageuse';
    const media = [...(project.media || [])];

    const youtubeUrls = Array.isArray(project.youtube)
      ? project.youtube
      : project.youtube
        ? [project.youtube]
        : [];

    youtubeUrls.forEach((youtubeUrl) => {
      media.push({ type: 'youtube', src: getYoutubeEmbedUrl(youtubeUrl) });
    });

    modalBody.innerHTML = `
			<h2 id="titre-modale">${project.name}</h2>
      ${
        project.tags?.length
          ? `
        <div class="etiquettes-modale">
          ${(project.tags || []).map((tag) => `<span class="etiquette">${tag}</span>`).join('')}
        </div>
      `
          : ''
      }
      ${
        media.length > 0
          ? `
        <div class="galerie-modale" aria-live="polite">
          ${isRoutine ? '<button class="media-precedent" type="button" aria-label="Média précédent">&lt;</button>' : ''}
          <div class="media-fenetre"></div>
          ${isRoutine ? '<button class="media-suivant" type="button" aria-label="Média suivant">&gt;</button>' : ''}
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

    if (media.length > 0) {
      let mediaIndex = 0;
      const mediaWindow = modalBody.querySelector('.media-fenetre');
      const previousButton = modalBody.querySelector('.media-precedent');
      const nextButton = modalBody.querySelector('.media-suivant');
      let touchStartX = 0;

      const renderMedia = () => {
        const currentMedia = media[mediaIndex];
        mediaWindow.innerHTML =
          currentMedia.type === 'youtube'
            ? `<iframe src="${currentMedia.src}" title="Vidéo YouTube de ${project.name}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
            : `<img src="${currentMedia}" alt="Média du projet ${project.name}" />`;
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

      if (isRoutine) {
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
