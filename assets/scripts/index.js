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



const getHeights = (main, logo, tagline, links) => {
	const updateVars = () => {
		document.body.style.setProperty(logoHeightVar,    ` ${logo.offsetHeight / 10}rem`)
		document.body.style.setProperty(taglineHeightVar, ` ${tagline.offsetHeight / 10}rem`)
		document.body.style.setProperty(linksHeightVar,   ` ${links.offsetHeight / 10}rem`)

		// Since it depends on the other heights.
		setTimeout(() => document.body.style.setProperty(mainHeightVar, ` ${main.offsetHeight / 10}rem`), 10)
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



const activeSection = (sections) => {
	sections.forEach((section) => {
		let activeClass = section.replace('#', '')

		const observer = new IntersectionObserver(entries => {
			const [entry] = entries;
			(entry.isIntersecting) ? document.body.classList.add(activeClass) : document.body.classList.remove(activeClass)
		}, {
			rootMargin: '-25% 0px -25% 0px',
		})

		setTimeout(() => observer.observe(document.querySelector(section)), 10) // Let the layout settle.
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
	const main =     document.querySelector('[data-main]')
	const logo =     document.querySelector('[data-logo]')
	const sections = [...logo.querySelectorAll('a')].map((link) => link.getAttribute('href'))
	const tagline =  document.querySelector('[data-tagline]')
	const nouns =    document.querySelector('[data-nouns]')
	const links =    document.querySelector('[data-links]')


	getHeights(main, logo, tagline, links)
	logoScrollScale(logo)
	invertBackground(nouns, links, invertClass)
	activeSection(sections)
	fixIphoneFlicker(logo, tagline)
})
