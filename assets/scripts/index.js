---
# Front-matter to make Jekyll process this file (poor-man JS pipeline).
---



{% include_relative _viewporter.js %}



const logoHeightVar =    '--logo--height'
const taglineHeightVar = '--tagline--height'
const scrollVar =        '--logo--scroll'



const getHeaderDimensions = (body, logo, tagline) => {
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



const getHeaderScroll = (body, logo) => {
	let scrollDistance = parseFloat(getComputedStyle(logo.parentElement).marginTop)

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

	const updateScroll = () => {
		// The extra/early 10px “softens” the transition a bit.
		scroll = clamp(((window.scrollY - scrollDistance + 10) / scrollDistance).toFixed(6), 0, 1)

		body.setProperty(scrollVar, ` ${scroll}`)
	}

	window.addEventListener('load', () => {
		scrollDistance = parseFloat(getComputedStyle(logo.parentElement).marginTop)

		updateScroll()
	})

	window.addEventListener('resize', () => {
		scrollDistance = parseFloat(getComputedStyle(logo.parentElement).marginTop)

		updateScroll()
	})

	window.addEventListener('scroll', () => {
		updateScroll()
	})
}



document.addEventListener('DOMContentLoaded', () => {
	const body = document.body.style
	const logo = document.getElementById('logo').firstElementChild
	const tagline = document.getElementById('tagline')

	getHeaderDimensions(body, logo, tagline)
	getHeaderScroll(body, logo)
})
