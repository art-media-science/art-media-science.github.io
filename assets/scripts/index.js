---
# Front-matter to make Jekyll process this file (poor-man JS pipeline).
---



{% include_relative _focus.js %}
{% include_relative _viewporter.js %}



const mainHeightVar =    '--main--height'
const logoHeightVar =    '--logo--height'
const taglineHeightVar = '--tagline--height'
const linksHeightVar =   '--links--height'
const scrollVar =        '--logo--scroll'

const invertClass =   'invert'
const activeClass =   'active'



const getHeights = (main, logo, tagline, links) => {
	const updateVars = () => {
		document.body.style.setProperty(logoHeightVar,    ` ${logo.offsetHeight / 10}rem`)
		document.body.style.setProperty(taglineHeightVar, ` ${tagline.offsetHeight / 10}rem`)
		document.body.style.setProperty(linksHeightVar,   ` ${links.offsetHeight / 10}rem`)

		setTimeout(() => { // Since it depends on the other heights.
			document.body.style.setProperty(mainHeightVar, ` ${main.offsetHeight / 10}rem`)
		}, 10)
	}

	window.addEventListener('load', updateVars)
	window.addEventListener('resize', updateVars)
}



logoScrollScale = (logo) => {
	let scrollDistance

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

	const updateScroll = () => {
		// The extra/early 10px “softens” the transition a bit.
		scroll = clamp(((window.scrollY - scrollDistance + 10) / scrollDistance).toFixed(6), 0, 1)

		document.body.style.setProperty(scrollVar, ` ${scroll}`)
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



const invertBackground = (nouns, links, invertClass) => {
	const checkBounds = () => {
		viewport = window.innerHeight
		nounsTop = nouns.getBoundingClientRect().top
		linksBottom = links.getBoundingClientRect().bottom; // Ternary gets angry without this semicolon?

		(nounsTop <= viewport &&  viewport <= linksBottom) ? document.body.classList.add(invertClass) : document.body.classList.remove(invertClass)
	}

	window.addEventListener('load', checkBounds)
	window.addEventListener('resize', checkBounds)
	window.addEventListener('scroll', checkBounds)
}



const activeSection = (logo, activeClass) => {
	const links = logo.querySelectorAll('a')

	links.forEach((link) => {
		// const section = document.getElementById(link.getAttribute('href'))
		const section = document.getElementById(link.getAttribute('href').replace('#', ''))

		const observer = new IntersectionObserver(entries => {
			const [entry] = entries
			if (entry.isIntersecting) {
				links.forEach((link) => link.classList.remove(activeClass))
				link.classList.add(activeClass)
			} else {
				link.classList.remove(activeClass)
			}
		}, {
			rootMargin: '-50% 0px -33% 0px',
		})

		window.addEventListener('load', observer.observe(section))
	})
}



const fixIphoneFlicker = (...elements) => {
	// iPhones… and narrow iPad views.
	if (navigator.platform.includes('iPhone') || navigator.platform.includes('iPad')) {
		elements.forEach((element) => {
			window.addEventListener('scroll', () => {
				// “Trill” the opacity to force a re-render while scrolling.
				(element.style.opacity == 1) ? element.style.opacity = 0.999 : element.style.opacity = 1
			})
		})
	}
}



document.addEventListener('DOMContentLoaded', () => {
	const main =    document.querySelector('[data-main]')
	const logo =    document.querySelector('[data-logo]')
	const tagline = document.querySelector('[data-tagline]')
	const nouns =   document.querySelector('[data-nouns]')
	const links =   document.querySelector('[data-links]')

	getHeights(main, logo, tagline, links)
	logoScrollScale(logo)
	invertBackground(nouns, links, invertClass)
	activeSection(logo, activeClass)
	fixIphoneFlicker(logo, tagline)
})
