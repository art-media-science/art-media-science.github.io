(() => {
	const ShowFocusClass = 'focus'

	const ShowFocusOnTabPress = () => {
		document.addEventListener('keydown', (event) => {
			if (event.key == 'Tab') document.documentElement.classList.add(ShowFocusClass)
		})
	}

	const RemoveFocusOnClick = () => {
		document.addEventListener('click', (event) => {
			if (event.clientX == 0 && event.clientY == 0) return
			document.documentElement.classList.remove(ShowFocusClass)
		})
	}



	document.addEventListener('DOMContentLoaded', () => {
		ShowFocusOnTabPress()
		RemoveFocusOnClick()
	})
})();

(() => {
	let orientationChanged = false
	let vhOffset = 0

	const html = document.documentElement

	const checkElementDims = (cssProperties) => {
		const testElement = document.createElement('div')
		testElement.style.cssText = cssProperties
		html.insertBefore(testElement, html.firstChild)
		const testElementDims = {
			'width': testElement.offsetWidth,
			'height': testElement.offsetHeight
		}
		html.removeChild(testElement)
		return testElementDims
	}

	const updateValue = (cssVariable, cssValue) => {
		cssValue ? html.style.setProperty(cssVariable, ` ${cssValue}px`) : html.style.removeProperty(cssVariable)
	}

	const updateVhOffset = () => {
		const initialVisibleHeight = checkElementDims('position: fixed; top: 0; bottom: 0;')['height']
		// Comparison for iOS in landscape, which does weird things with bottom-fixed elements.
		const visibleHeight = window.innerHeight;
		const vh100 = checkElementDims('position: fixed; top: 0; height: 100vh')['height']
		vhOffset = vh100 - Math.min(initialVisibleHeight, visibleHeight)

		updateValue('--vh--offset', vhOffset)
		if (vhOffset) updateValue('--vh--initial', visibleHeight)
	}

	const updateInnerHeight = () => {
		if (vhOffset) updateValue('--inner-height', window.innerHeight)
	}

	const updateScrollbarWidth = () => {
		html.style.setProperty(`overflow-y`, ` scroll`)
		const percent100 = checkElementDims('position: fixed; top: 0; width: 100%; height: 200vh;')['width']
		const scrollbarWidth = window.innerWidth - percent100
		html.style.removeProperty(`overflow-y`)
		updateValue('--scrollbar', scrollbarWidth)
	}

	const orientationDirection = () => {
		// Which way is an iPhone rotated?
		if (navigator.userAgent.includes('AppleWebKit') && !navigator.userAgent.includes('Chrome')) {
			(window.orientation == 90) ? html.classList.add('counter-clockwise'): html.classList.remove('counter-clockwise');
			(window.orientation == -90) ? html.classList.add('clockwise'): html.classList.remove('clockwise');
		}
	}



	document.addEventListener('DOMContentLoaded', () => {
		if (navigator.appVersion.includes("Win")) html.classList.add('windows')

		updateVhOffset()
		updateInnerHeight()
		updateScrollbarWidth()
		orientationDirection()
	})

	window.addEventListener('orientationchange', () => {
		orientationChanged = true

		orientationDirection()
		setTimeout(() => window.dispatchEvent(new Event('resize')), 250); // For other things listening that are a bit behind.
		setTimeout(() => orientationChanged = false, 750)
	})

	window.addEventListener('resize', () => {
		updateScrollbarWidth()
		updateInnerHeight()

		if (orientationChanged) updateVhOffset()
	})
})();




const mainHeightVar = '--main--height'
const logoHeightVar = '--logo--height'
const taglineHeightVar = '--tagline--height'
const linksHeightVar = '--links--height'
const scrollVar = '--logo--scroll'

const invertClass = 'invert'
const mainClass = 'main'

let nounCycle
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



const watchMainVisible = (nouns, links, content) => {
	let scrollDown

	const checkBounds = () => {
		viewport = window.innerHeight
		contentTop = content.getBoundingClientRect().top
		linksBottom = links.getBoundingClientRect().bottom

		if (contentTop <= viewport && viewport <= linksBottom) { // Intersecting.
			if (!body.contains(mainClass)) {
				body.add(mainClass)
				nouns.forEach((noun) => body.remove(noun))
			}
			if (body.contains(invertClass)) setTimeout(() => body.remove(invertClass), 100) // Delayed to differentiate in/out.
		} else {
			if (body.contains(mainClass)) {
				body.remove(mainClass)

				if (scrollDown) nouns.forEach((noun) => body.remove(noun))

				cycleRandomNoun(nouns)
			}
			if (!body.contains(invertClass)) setTimeout(() => body.add(invertClass), 100)
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



watchCurrentNoun = (nouns) => {
	nouns.forEach((noun) => {
		const observer = new IntersectionObserver(entries => {
			const [entry] = entries;
			if (body.contains(mainClass)) {
				(entry.isIntersecting) ? body.add(noun): body.remove(noun)
			}
		}, {
			rootMargin: '-25% 0px -25% 0px',
			threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] // Catch “Science” more times coming back up from footer.
		})

		setTimeout(() => observer.observe(document.getElementById(noun)), 10) // Let the layout settle.
	})
}



const randomNoun = (nouns) => {
	if (!body.contains(mainClass)) {
		let randomNoun = nouns[Math.floor(Math.random() * nouns.length)]

		while (body.contains(randomNoun)) {
			randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
		}
		nouns.forEach((noun) => body.remove(noun))
		body.add(randomNoun)
	}
}

const cycleRandomNoun = (nouns) => {
	clearInterval(nounCycle) // Clear the timer, if there is one.
	randomNoun(nouns) // Apply the first one.
	setTimeout(() => randomNoun(nouns), 200) // Again so it is fading right away.
	nounCycle = setInterval(() => randomNoun(nouns), nounCycleTimer) // Then on a timer.
}




const fixMobileSafariFlicker = (...elements) => {
	// iPhones… and narrow iPad views.
	if (navigator.platform.includes('iPhone') || navigator.platform.includes('iPad')) {
		elements.forEach((element) => {
			window.addEventListener('scroll', () => {
				// “Trill” the opacity to force a re-render while scrolling.
				(element.style.opacity == 1) ? element.style.opacity = 0.999: element.style.opacity = 1
			})
		})
	}
}



document.addEventListener('DOMContentLoaded', () => {
	window.body = document.body.classList // Save some repetition.

	const main = document.querySelector('[data-main]')
	const logo = document.querySelector('[data-logo]')
	const tagline = document.querySelector('[data-tagline]')
	const content = document.querySelector('[data-content]')
	const links = document.querySelector('[data-links]')

	const nouns = [...logo.querySelectorAll('a')].map((link) => link.getAttribute('href').replace('#', ''))

	getHeights(main, logo, tagline, links)
	getScrollDistance(logo)
	watchMainVisible(nouns, links, content)
	watchCurrentNoun(nouns)
	cycleRandomNoun(nouns)
	fixMobileSafariFlicker(logo, tagline)
})