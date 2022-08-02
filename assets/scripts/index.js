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
	let resetOffset = false
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
		if (vhOffset) {
			updateValue('--vh--initial', visibleHeight)
			resetOffset = false
		} else {
			updateValue('--vh--initial', null)
			resetOffset = true
		}
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
		setTimeout(() => orientationChanged = false, 200)
	})

	window.addEventListener('resize', () => {
		updateScrollbarWidth()
		updateInnerHeight()

		if (orientationChanged || resetOffset) updateVhOffset()
	})
})();



const nouns = ['art', 'media', 'science']

const mainHeightVar = '--main--height'
const logoHeightVar = '--logo--height'
const taglineHeightVar = '--tagline--height'
const linksHeightVar = '--links--height'
const colophonHeightVar = '--colophon--height'
const scrollVar = '--logo--scroll'
const bounceVar = '--logo--bounce'

const loadingClass = 'loading'
const cyclingClass = 'cycling'
const mainClass = 'main'
const topClass = 'top'
const headerClass = 'header'
const footerClass = 'footer'
const bottomClass = 'bottom'
const aboutHash = '#about'

let hashReady = false
let hashDelay



const updateHash = (hash) => {
	if (hashReady) {
		hash = (hash) ? (hash[0] != '#') ? `#${hash}` : hash : window.location.pathname + window.location.search

		clearTimeout(hashDelay)

		hashDelay = setTimeout(() => {
			if (hash != window.location.hash) history.replaceState('', '', hash)
		}, 50) // Long enough to skip over any in-between anchors.
	}
}

const isLandscape = () => (window.innerWidth > window.innerHeight || window.innerWidth >= 768)




const getHeights = (main, logo, tagline, links, colophon) => {
	const setHeightVar = (element, variable) => document.body.style.setProperty(variable, ` ${element.offsetHeight / 10}rem`)

	const updateVars = () => {
		setHeightVar(logo, logoHeightVar)
		setHeightVar(tagline, taglineHeightVar)
		setHeightVar(links, linksHeightVar)
		setHeightVar(colophon, colophonHeightVar)

		setTimeout(() => setHeightVar(main, mainHeightVar), 10) // Since it depends on the other heights.
	}

	window.addEventListener('load', updateVars)
	window.addEventListener('resize', updateVars)
}

const getScrollDistance = (logo) => {
	let scrollOffset

	const clampZeroOne = (number) => Math.min(Math.max(number.toFixed(6), 0), 1)
	const updateScrollDistance = () => scrollOffset = parseFloat(getComputedStyle(logo.parentElement).marginTop)

	const updateScroll = () => {
		const scaleDifference = logo.offsetHeight - logo.parentElement.offsetHeight
		const scrollProgress = window.scrollY - scrollOffset + 8 // The extra/early 8px “softens” the scaling start.
		const scrollDistance = scrollOffset + scaleDifference

		let easing = (x) => 1 - Math.pow(1 - x, 4) // easeOutQuart.
		let bounce = (x) => (Math.sin(2 * Math.PI * (x - 1 / 4)) + 1) / 2 // Bell curve.

		scroll = clampZeroOne((scrollProgress) / scrollDistance)
		scrollEarly = clampZeroOne((scrollProgress + 24) / (scrollDistance - 24)) // “Peaks” the bounce sooner.

		// Different ease/bounce for landscape layout.
		if (isLandscape()) easing = (x) => 1 - Math.pow(1 - x, 2) // easeOut…Square?
		if (isLandscape()) scrollEarly = clampZeroOne((scrollProgress + 36) / (scrollDistance + 48))

		document.body.style.setProperty(scrollVar, ` ${easing(scroll)}`)
		document.body.style.setProperty(bounceVar, ` ${bounce(scrollEarly)}`)
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
			if (contentTop > viewport) { // In the “header”.
				body.add(headerClass)
				updateHash()
			} else {
				body.remove(headerClass)
			}
			if (viewport > linksEdge) { // In the “footer”.
				body.add(footerClass)
				updateHash(aboutHash)
			} else {
				body.remove(footerClass)
			}
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
	let nounOverlap = [] // Since the nouns “overlap”.

	nouns.forEach((noun) => {
		const observer = new IntersectionObserver(entries => {
			const [entry] = entries;
			if (body.contains(mainClass)) {
				if (entry.isIntersecting) {
					if (!nounOverlap.includes(noun)) nounOverlap.push(noun) // Only add it once.

					let currentNoun = nounOverlap[nounOverlap.length - 1] // Always take the last one.

					body.remove(...nouns.filter(noun => noun != currentNoun)) // Remove the others.
					body.add(currentNoun)
					updateHash(currentNoun)
				} else {
					if (nounOverlap.includes(noun)) nounOverlap = nounOverlap.filter(noun => noun != noun) // Toss the exiting one.
				}
			}
		}, {
			rootMargin: '-25% 0px -25% 0px',
			threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] // Catch “Science” more times coming back up from footer.
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
		if (event.propertyName == 'background-color' && event.target == document.body && !event.pseudoElement && !body.contains(mainClass)) {
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



const cycleFavicon = (favicon) => {
	// Only works in Chrome and Firefox.
	if (navigator.userAgent.includes('Chrome') || navigator.userAgent.includes('Firefox')) {
		const updateFavicon = () => {
			let background = getComputedStyle(document.body, ':before').backgroundColor // The “swatch”.
			let uri = favicon.href.replace(/fill='(.*?)'/, `fill='${encodeURI(background)}'`)
			favicon.setAttribute('href', uri)
		}

		setInterval(() => updateFavicon(), 50)
	}
}



document.addEventListener('DOMContentLoaded', () => {
	window.body = document.body.classList // Save some repetition.

	const main = document.querySelector('[data-main]')
	const logo = document.querySelector('[data-logo]')
	const tagline = document.querySelector('[data-tagline]')
	const content = document.querySelector('[data-content]')
	const links = document.querySelector('[data-links]')
	const colophon = document.querySelector('[data-colophon]')
	const favicon = document.querySelector('[data-favicon]')

	getHeights(main, logo, tagline, links, colophon)
	getScrollDistance(logo)
	watchTop()
	watchMain(links, content)
	watchNouns()
	watchTaglineTop(tagline)
	cycleRandomNoun()
	fixMobileSafariFlicker(logo, tagline)
	setInterval(() => cycleFavicon(favicon), 150) // Reduce the flash in.
})

window.addEventListener('load', () => {
	if (window.location.hash) {
		setTimeout(() => {
			document.querySelector(window.location.hash).scrollIntoView()
			setTimeout(() => document.documentElement.classList.remove(loadingClass), 10) // Scroll is set to auto (instant).
			hashReady = true
		}, 100) // After the layout slosh, presumably.

	} else {
		hashReady = true

		setTimeout(() => document.documentElement.classList.remove(loadingClass), 100) // Wait a tick so the other events clear.
	}
})