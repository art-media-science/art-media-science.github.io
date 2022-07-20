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

const invertClass = 'invert'
const mainClass =   'main'

let   cycleSection
const cycleSectionTimer = 8000



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



const getScrollDistance = (logo) => {
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



const watchMainVisible = (nouns, links, mainClass, sections) => {
	let scrollDown

	const checkBounds = () => {
		viewport = window.innerHeight
		nounsTop = nouns.getBoundingClientRect().top
		linksBottom = links.getBoundingClientRect().bottom

		if (nounsTop <= viewport &&  viewport <= linksBottom) {
			if (!document.body.classList.contains(mainClass)) {
				document.body.classList.add(mainClass)
				sections.forEach((section) => document.body.classList.remove(section))
			}
			setTimeout(() => document.body.classList.remove(invertClass), 100) // Delayed to differentiate in/out.
		} else {
			if (document.body.classList.contains(mainClass)) {
				document.body.classList.remove(mainClass)

				if (scrollDown) sections.forEach((section) => document.body.classList.remove(section))

				cycleRandomSection(sections)
			}
			setTimeout(() => document.body.classList.add(invertClass), 100)
		}
	}

	window.addEventListener('load', checkBounds)
	window.addEventListener('resize', checkBounds)

	window.addEventListener('scroll', () => {
		checkBounds();

		scrollDown = this.previousScroll < this.scrollY
		this.previousScroll = this.scrollY
	})
}



watchCurrentSection = (sections) => {
	sections.forEach((section) => {
		const observer = new IntersectionObserver(entries => {
			const [entry] = entries;
			if (document.body.classList.contains(mainClass)) {
				(entry.isIntersecting) ? document.body.classList.add(section) : document.body.classList.remove(section)
			}
		}, {
			rootMargin: '-25% 0px -25% 0px',
			threshold:  [0, 0.1, 0.25, 0.5, 0.75, 1] // Catch “Science” more times coming back up from footer.
		})

		setTimeout(() => observer.observe(document.getElementById(section)), 10) // Let the layout settle.
	})
}



const randomSection = (sections) => {
	if (!document.body.classList.contains(mainClass)) {
		let randomSection = sections[Math.floor(Math.random() * sections.length)]

		while (document.body.classList.contains(randomSection)) {
			randomSection = sections[Math.floor(Math.random() * sections.length)]
		}
		sections.forEach((section) => document.body.classList.remove(section))
		document.body.classList.add(randomSection)
	}
}

const cycleRandomSection = (sections) => {
	clearInterval(cycleSection) // Clear the timer, if there is one.
	randomSection(sections) // Apply the first one.
	setTimeout(() => randomSection(sections), 200) // Again so it is fading right away.
	cycleSection = setInterval(() => randomSection(sections), cycleSectionTimer) // Then on a timer.
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
	const tagline =  document.querySelector('[data-tagline]')
	const nouns =    document.querySelector('[data-nouns]')
	const links =    document.querySelector('[data-links]')
	const sections = [...logo.querySelectorAll('a')].map((link) => link.getAttribute('href').replace('#', ''))

	getHeights(main, logo, tagline, links)
	getScrollDistance(logo)
	watchMainVisible(nouns, links, mainClass, sections)
	watchCurrentSection(sections)
	cycleRandomSection(sections)
	fixIphoneFlicker(logo, tagline)
})
