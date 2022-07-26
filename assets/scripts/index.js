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
const cyclingClass = 'cycling'
const mainClass =    'main'
const topClass =     'top'
const headerClass =  'header'
const footerClass =  'footer'
const bottomClass =  'bottom'



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
	let scrollOffset

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
	const updateScrollDistance = () => scrollOffset = parseFloat(getComputedStyle(logo.parentElement).marginTop)

	const updateScroll = () => {
		scaleDifference = logo.offsetHeight - logo.parentElement.offsetHeight

		easing = (x) => 1 - Math.pow(1 - x, 4) // easeOutQuart.

		// Different ease for landscape layout.
		if (window.innerWidth > window.innerHeight || window.innerWidth >= 768) easing = (x) => 1 - Math.pow(1 - x, 2) // easeOut…Square?

		// The extra/early 8px “softens” the transition start a bit.
		scroll = clamp(((window.scrollY - scrollOffset + 8) / (scrollOffset + scaleDifference)).toFixed(6), 0, 1)

		document.body.style.setProperty(scrollVar, ` ${easing(scroll)}`)
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
				body.remove(...nouns, headerClass, footerClass, cyclingClass)
				body.add(mainClass)
			}
		} else {
			(contentTop > viewport) ? body.add(headerClass) : body.remove(headerClass); // In the “header”.
			(viewport > linksBottom) ? body.add(footerClass) : body.remove(footerClass); // In the “footer”.
			if (body.contains(mainClass)) { // Only scrolling out.
				body.remove(...nouns, mainClass)
				cycleRandomNoun(nouns)
			}
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
	randomNoun(nouns) // Apply the first one.

	ontransitionend = () => {
		if (event.propertyName == 'background-color' && event.target == document.body && !body.contains(mainClass)) {
			body.add(cyclingClass)
			randomNoun(nouns)
		}
	}
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
