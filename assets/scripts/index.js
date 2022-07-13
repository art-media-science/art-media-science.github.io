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

const getHeaderScroll = () => {
	const body = document.body.style
	const logo = document.getElementById('logo')

	const scrollVariable = '--logo--scroll'

	let scrollDistance = parseFloat(getComputedStyle(logo).marginTop)

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

	const updateScroll = () => {
		scroll = clamp((1 - (scrollDistance - window.scrollY) / scrollDistance).toFixed(6), 0, 1)

		body.setProperty(scrollVariable, ` ${scroll}`)
	}

	updateScroll()

	window.addEventListener('resize', () => {
		scrollDistance = parseFloat(getComputedStyle(logo).marginTop)

		updateScroll()
	})

	window.addEventListener('scroll', () => {
		updateScroll()
	})
}



document.addEventListener('DOMContentLoaded', () => {
	getHeaderDimensions()
	getHeaderScroll()
})
