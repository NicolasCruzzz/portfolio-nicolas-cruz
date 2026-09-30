export function createProjectCard(project) {
	return `
		<article class="carte-projet">
			<h3>${project.name}</h3>
			<p>${project.description}</p>
			${project.video ? `<a href="${project.video}" target="_blank" rel="noreferrer">Voir la vidéo</a>` : ''}
		</article>
	`;
}
