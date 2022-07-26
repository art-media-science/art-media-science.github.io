---
# Front-matter to make Jekyll process this file (poor-man JS pipeline).
---



{% include_relative _focus.js %}
{% include_relative _viewporter.js %}


const nouns = ['art', 'media', 'science']

const mainHeightVar =    '--main--height'
const logoHeightVar =    '--logo--height'
const taglineHeightVar = '--tagline--height'
const linksHeightVar =   '--links--height'
const scrollVar =        '--logo--scroll'

const loadingClass = 'loading'
const invertClass =  'invert'
const mainClass =    'main'
const topClass =     'top'
const headerClass =  'header'
const footerClass =  'footer'
const bottomClass =  'bottom'

let   nounCycle
const nounCycleTimer = 8000



const getHeights = (main, logo, tagline, links) => {
	const setHeightVar = (element, variable) => document.body.style.setProperty(variable, ` ${element.offsetHeight / 10}rem`)

	const updateVars = () => {
		setHeightVar(logo, logoHeightVar)
		setHeightVar(tagline, taglineHeightVar)
		setHeightVar(links, linksHeightVar)

		setTimeout(() => setHeightVar(main, mainHeightVar), 10) // Since it depends on the other heights.
	}

	window.addEventListener('load', updateVars)
	window.addEventListener('resize', updateVars)
}



const getScrollDistance = (logo) => {
	let scrollDistance

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
	const updateScrollDistance = () => scrollDistance = parseFloat(getComputedStyle(logo.parentElement).marginTop)

	const updateScroll = () => {
		// The extra/early 10px “softens” the transition a bit.
		scroll = clamp(((window.scrollY - scrollDistance + 10) / scrollDistance).toFixed(6), 0, 1)

		document.body.style.setProperty(scrollVar, ` ${scroll}`)
	}

	window.addEventListener('load', () => {
		updateScrollDistance()
		updateScroll()
	})

	window.addEventListener('resize', () => {
		updateScrollDistance()
		updateScroll()
	})

	window.addEventListener('scroll', updateScroll)
}



watchTop = () => {
	const checkTop = () => (window.scrollY > 0) ? body.remove(topClass) : body.add(topClass)

	window.addEventListener('load', checkTop)
	window.addEventListener('resize', checkTop)
	window.addEventListener('scroll', checkTop)
}



const watchMain = (links, content) => {
	const checkBounds = () => {
		viewport =    window.innerHeight
		contentTop =  content.getBoundingClientRect().top
		linksBottom = links.getBoundingClientRect().bottom


		if (contentTop <= viewport && viewport <= linksBottom) { // Intersecting.
			if (!body.contains(mainClass)) { // Only do it once.
				body.remove(...nouns, headerClass, footerClass)
				body.add(mainClass)
			}
			if (body.contains(invertClass)) setTimeout(() => body.remove(invertClass), 100) // Delayed to differentiate in/out.
		} else {
			(contentTop > viewport) ? body.add(headerClass) : body.remove(headerClass); // In the “header”.
			(viewport > linksBottom) ? body.add(footerClass) : body.remove(footerClass); // In the “footer”.
			if (body.contains(mainClass)) { // Only scrolling out.
				body.remove(...nouns, mainClass)
				cycleRandomNoun(nouns)
			}
			if (!body.contains(invertClass)) setTimeout(() => body.add(invertClass), 100)
		}
	}

	window.addEventListener('load', checkBounds)
	window.addEventListener('resize', checkBounds)
	window.addEventListener('scroll', checkBounds)
}



watchNouns = () => {
	nouns.forEach((noun) => {
		const observer = new IntersectionObserver(entries => {
			const [entry] = entries;
			if (body.contains(mainClass)) {
				(entry.isIntersecting) ? body.add(noun) : body.remove(noun)
			}
		}, {
			rootMargin: '-25% 0px -25% 0px',
			threshold:  [0, 0.1, 0.25, 0.5, 0.75, 1] // Catch “Science” more times coming back up from footer.
		})

		setTimeout(() => observer.observe(document.getElementById(noun)), 10) // Let the layout settle.
	})
}



watchTaglineTop = (tagline) => {
	const checkTop = () => {
		viewport =      window.innerHeight
		headerPadding = parseInt(getComputedStyle(tagline.parentElement).paddingBottom)
		taglineTop    = parseInt(tagline.getBoundingClientRect().top); // Dumb ternary semicolon thing.

		(taglineTop - headerPadding <= 0) ? body.add(bottomClass) : body.remove(bottomClass)
	}

	window.addEventListener('load', checkTop)
	window.addEventListener('resize', checkTop)
	window.addEventListener('scroll', checkTop)
}



const randomNoun = () => {
	if (!body.contains(mainClass)) {
		let randomNoun = nouns[Math.floor(Math.random() * nouns.length)]

		while (body.contains(randomNoun)) {
			randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
		}
		body.remove(...nouns)
		body.add(randomNoun)
	}
}

const cycleRandomNoun = () => {
	clearInterval(nounCycle) // Clear the timer, if there is one.
	randomNoun(nouns) // Apply the first one.
	setTimeout(() => randomNoun(nouns), 300) // Again so it is fading right away.
	nounCycle = setInterval(() => randomNoun(nouns), nounCycleTimer) // Then on a timer.
}




const fixMobileSafariFlicker = (...elements) => {
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
	window.body = document.body.classList // Save some repetition.

	const main =    document.querySelector('[data-main]')
	const logo =    document.querySelector('[data-logo]')
	const tagline = document.querySelector('[data-tagline]')
	const content = document.querySelector('[data-content]')
	const links =   document.querySelector('[data-links]')

	getHeights(main, logo, tagline, links)
	getScrollDistance(logo)
	watchTop()
	watchMain(links, content)
	watchNouns()
	watchTaglineTop(tagline)
	cycleRandomNoun()
	fixMobileSafariFlicker(logo, tagline)
})

window.addEventListener('load', () => {
	setTimeout(() => body.remove(loadingClass), 100) // Wait a tick so the other events clear.
})
