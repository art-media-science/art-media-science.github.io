---
# Front-matter to make Jekyll process this file (poor-man JS pipeline).
---



{% include_relative _focus.js %}
{% include_relative _viewporter.js %}



const logoHeightVar =    '--logo--height'
const taglineHeightVar = '--tagline--height'
const linksHeightVar =   '--links--height'
const scrollVar =        '--logo--scroll'

const invertClass =   'invert'



const getHeights = (body, header, logo, tagline, links) => {
	let logoHeight =    logo.offsetHeight
	let taglineHeight = tagline.offsetHeight
	let linksHeight =   links.offsetHeight

	const updateVars = () => {
		body.style.setProperty(logoHeightVar, ` ${logoHeight / 10}rem`)
		body.style.setProperty(taglineHeightVar, ` ${taglineHeight / 10}rem`)
		body.style.setProperty(linksHeightVar, ` ${linksHeight / 10}rem`)
	}

	updateVars()

	window.addEventListener('resize', () => {
		logoHeight =    logo.offsetHeight
		taglineHeight = tagline.offsetHeight
		linksHeight =   links.offsetHeight

		updateVars()
	})
}



logoScrollScale = (body, logo) => {
	let scrollDistance = parseFloat(getComputedStyle(logo.parentElement).marginTop)

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

	const updateScroll = () => {
		// The extra/early 10px “softens” the transition a bit.
		scroll = clamp(((window.scrollY - scrollDistance + 10) / scrollDistance).toFixed(6), 0, 1)

		body.style.setProperty(scrollVar, ` ${scroll}`)
	}

	window.addEventListener('load', () => {
		scrollDistance = parseFloat(getComputedStyle(logo.parentElement).marginTop)

		updateScroll()
	})

	window.addEventListener('resize', () => {
		scrollDistance = parseFloat(getComputedStyle(logo.parentElement).marginTop)

		updateScroll()
	})

	window.addEventListener('scroll', updateScroll)
}



const invertBackground = (body, nouns, className) => {
	let viewport = window.innerHeight
	let nounsTop = nouns.getBoundingClientRect().top

	const checkTop = () => {
		viewport = window.innerHeight
		nounsTop = nouns.getBoundingClientRect().top; // Ternary gets angry without this semicolon?

		(nounsTop <= viewport) ? body.classList.add(className) : body.classList.remove(className)
	}

	window.addEventListener('load', checkTop)
	window.addEventListener('resize', checkTop)
	window.addEventListener('scroll', checkTop)
}



document.addEventListener('DOMContentLoaded', () => {
	const body =    document.body
	const logo =    document.querySelector('[data-logo]')
	const tagline = document.querySelector('[data-tagline]')
	const nouns =   document.querySelector('[data-nouns]')
	const links =   document.querySelector('[data-links]')

	getHeights(body, header, logo, tagline, links)
	logoScrollScale(body, logo)
	invertBackground(body, nouns, invertClass)
})
