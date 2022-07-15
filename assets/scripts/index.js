---
# Front-matter to make Jekyll process this file (poor-man JS pipeline).
---



{% include_relative _focus.js %}
{% include_relative _viewporter.js %}



const headerHeightVar =  '--header--height'
const logoHeightVar =    '--logo--height'
const taglineHeightVar = '--tagline--height'
const linksHeightVar =   '--links--height'
const scrollVar =        '--logo--scroll'

const invertClass =   'invert'



const getHeights = (body, header, logo, tagline, links) => {
	const updateVars = () => {
		body.style.setProperty(logoHeightVar,    ` ${logo.offsetHeight / 10}rem`)
		body.style.setProperty(taglineHeightVar, ` ${tagline.offsetHeight / 10}rem`)
		body.style.setProperty(linksHeightVar,   ` ${links.offsetHeight / 10}rem`)

		setTimeout(() => { // Since it depends on the other heights.
			body.style.setProperty(headerHeightVar, ` ${header.offsetHeight / 10}rem`)
		}, 10)
	}

	window.addEventListener('load', updateVars)
	window.addEventListener('resize', updateVars)
}



logoScrollScale = (body, logo) => {
	let scrollDistance

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



const invertBackground = (body, nouns, links, invertClass) => {
	const checkBounds = () => {
		viewport = window.innerHeight
		nounsTop = nouns.getBoundingClientRect().top
		linksBottom = links.getBoundingClientRect().bottom; // Ternary gets angry without this semicolon?

		(nounsTop <= viewport &&  viewport <= linksBottom) ? body.classList.add(invertClass) : body.classList.remove(invertClass)
	}

	window.addEventListener('load', checkBounds)
	window.addEventListener('resize', checkBounds)
	window.addEventListener('scroll', checkBounds)
}



document.addEventListener('DOMContentLoaded', () => {
	const body =    document.body
	const header =  document.querySelector('[data-header]')
	const logo =    document.querySelector('[data-logo]')
	const tagline = document.querySelector('[data-tagline]')
	const nouns =   document.querySelector('[data-nouns]')
	const links =   document.querySelector('[data-links]')

	getHeights(body, header, logo, tagline, links)
	logoScrollScale(body, logo)
	invertBackground(body, nouns, links, invertClass)
})
