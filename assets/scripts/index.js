---
# Front-matter to make Jekyll process this file (poor-man JS pipeline).
---



{% include_relative _focus.js %}
{% include_relative _viewporter.js %}



const logoHeightVar =    '--logo--height'
const taglineHeightVar = '--tagline--height'
const scrollVar =        '--logo--scroll'

const mainVisibleClass =   'main--visible'



const getHeaderDimensions = (body, logo, tagline) => {
	let logoHeight = logo.offsetHeight
	let taglineHeight = tagline.offsetHeight

	const updateVars = () => {
		body.style.setProperty(logoHeightVar, ` ${logoHeight / 10}rem`)
		body.style.setProperty(taglineHeightVar, ` ${taglineHeight / 10}rem`)
	}

	updateVars()

	window.addEventListener('resize', () => {
		logoHeight = logo.offsetHeight
		taglineHeight = tagline.offsetHeight

		updateVars()
	})
}



const getHeaderScroll = (body, logo) => {
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



const mainVisible = (body, element, classname) => {
	let viewport = window.innerHeight
	let elementTop = element.getBoundingClientRect().top

	const checkTop = () => {
		viewport = window.innerHeight
		elementTop = element.getBoundingClientRect().top; // Ternary gets angry without this semicolon?

		(elementTop <= viewport) ? body.classList.add(classname) : body.classList.remove(classname)
	}

	window.addEventListener('load', checkTop)
	window.addEventListener('resize', checkTop)
	window.addEventListener('scroll', checkTop)
}



document.addEventListener('DOMContentLoaded', () => {
	const body =    document.body
	const logo =    document.getElementById('logo').firstElementChild
	const tagline = document.getElementById('tagline')
	const main =    document.querySelector('main')

	getHeaderDimensions(body, logo, tagline)
	getHeaderScroll(body, logo)
	mainVisible(body, main, mainVisibleClass)
})
