---
# Front-matter to make Jekyll process this file (poor-man JS pipeline).
---



{% include_relative _viewporter.js %}



const getHeaderDimensions = () => {
	const body = document.body.style
	const logo = document.getElementById('logo').firstElementChild
	const tagline = document.getElementById('tagline')

	const logoHeightVar = '--logo--height'
	const taglineHeightVar = '--tagline--height'

	let logoHeight = logo.offsetHeight
	let taglineHeight = tagline.offsetHeight

	body.setProperty(logoHeightVar, ` ${logoHeight / 10}rem`)
	body.setProperty(taglineHeightVar, ` ${taglineHeight / 10}rem`)

	window.addEventListener('resize', () => {
		logoHeight = logo.offsetHeight
		taglineHeight = tagline.offsetHeight

		body.setProperty(logoHeightVar, ` ${logoHeight / 10}rem`)
		body.setProperty(taglineHeightVar, ` ${taglineHeight / 10}rem`)
	})
}

const scrollHeaderScale = () => {
	const main = document.querySelector('main')
	const mainClass = 'main--visible'

	const mainVisible = new IntersectionObserver(entries => {
		const [entry] = entries
		entry.isIntersecting ? document.body.classList.add(mainClass) : document.body.classList.remove(mainClass);
	})

	mainVisible.observe(main)
}



document.addEventListener('DOMContentLoaded', () => {
	getHeaderDimensions()
	scrollHeaderScale()
})
