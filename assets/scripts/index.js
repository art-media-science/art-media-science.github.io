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



const nouns = ['art', 'media', 'science']

const mainHeightVar = '--main--height'
const logoHeightVar = '--logo--height'
const taglineHeightVar = '--tagline--height'
const linksHeightVar = '--links--height'
const scrollVar = '--logo--scroll'

const loadingClass = 'loading'
const cyclingClass = 'cycling'
const mainClass = 'main'
const topClass = 'top'
const headerClass = 'header'
const footerClass = 'footer'
const bottomClass = 'bottom'



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



const isLandscape = () => (window.innerWidth > window.innerHeight || window.innerWidth >= 768)



const getScrollDistance = (logo) => {
	let scrollOffset

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max)
	const updateScrollDistance = () => scrollOffset = parseFloat(getComputedStyle(logo.parentElement).marginTop)

	const updateScroll = () => {
		const scaleDifference = logo.offsetHeight - logo.parentElement.offsetHeight

		let easing = (x) => 1 - Math.pow(1 - x, 4) // easeOutQuart.

		// Different ease for landscape layout.
		if (isLandscape()) easing = (x) => 1 - Math.pow(1 - x, 2) // easeOut…Square?

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
		const viewport = window.innerHeight
		const linksBounds = links.getBoundingClientRect()
		const contentTop = content.getBoundingClientRect().top

		const linksEdge = (isLandscape()) ? linksBounds.top : linksBounds.bottom

		if (contentTop <= viewport && viewport <= linksEdge) { // Intersecting.
			if (!body.contains(mainClass)) { // Only do it once.
				body.remove(...nouns, headerClass, footerClass, cyclingClass)
				body.add(mainClass)
			}
		} else {
			(contentTop > viewport) ? body.add(headerClass): body.remove(headerClass); // In the “header”.
			(viewport > linksEdge) ? body.add(footerClass): body.remove(footerClass); // In the “footer”.
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
				(entry.isIntersecting) ? body.add(noun): body.remove(noun)
			}
		}, {
			rootMargin: '-25% 0px -25% 0px',
			threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] // Catch “Science” more times coming back up from footer.
		})

		setTimeout(() => observer.observe(document.getElementById(noun)), 10) // Let the layout settle.
	})
}



watchTaglineTop = (tagline) => {
	const checkTop = () => {
		const viewport = window.innerHeight
		const headerPadding = parseInt(getComputedStyle(tagline.parentElement).paddingBottom)
		const taglineTop = parseInt(tagline.getBoundingClientRect().top); // Dumb ternary semicolon thing.

		(taglineTop - headerPadding <= 0) ? body.add(bottomClass): body.remove(bottomClass)
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