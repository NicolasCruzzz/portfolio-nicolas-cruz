export function createProjectCard(project) {
  return `
		<article class="carte-projet" data-project-id="${project.id}" tabindex="0" role="button" aria-label="Voir les détails de ${project.name}">
			<img class="icone-cercle" src="assets/icones/cercle.png" alt="" />
			<h3>${project.name}</h3>
		</article>
	`;
}
