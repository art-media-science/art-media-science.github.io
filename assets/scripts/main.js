---
# Front-matter to make Jekyll process this file (poor-man JS pipeline).
---


{% include_relative _viewporter.js %}



document.addEventListener('DOMContentLoaded', () => {
		const mainElement = document.querySelector('main')
		const mainElementClass = 'main--visible'

		const mainElementVisible = new IntersectionObserver(entries => {
			const [entry] = entries
			entry.isIntersecting ? document.body.classList.add(mainElementClass) : document.body.classList.remove(mainElementClass);
		})

		mainElementVisible.observe(mainElement)
})
