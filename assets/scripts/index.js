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




const logoHeightVar = '--logo--height'
const taglineHeightVar = '--tagline--height'
const scrollVar = '--logo--scroll'

const mainVisibleClass = 'main--visible'
const footerVisibleClass = 'footer--visible'



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



const isVisible = (body, element, classname) => {
	let viewport = window.innerHeight
	let elementTop = element.getBoundingClientRect().top

	const checkTop = () => {
		viewport = window.innerHeight
		elementTop = element.getBoundingClientRect().top; // Ternary gets angry without this semicolon?

		(elementTop <= viewport) ? body.classList.add(classname): body.classList.remove(classname)
	}

	window.addEventListener('load', checkTop)
	window.addEventListener('resize', checkTop)
	window.addEventListener('scroll', checkTop)
}



document.addEventListener('DOMContentLoaded', () => {
	const body = document.body
	const logo = document.getElementById('logo').firstElementChild
	const tagline = document.getElementById('tagline')
	const main = document.querySelector('main')
	const footer = document.querySelector('footer')

	getHeaderDimensions(body, logo, tagline)
	getHeaderScroll(body, logo)
	isVisible(body, main, mainVisibleClass)
	isVisible(body, footer, footerVisibleClass)
})