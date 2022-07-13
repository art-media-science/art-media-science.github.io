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
})()




const getHeaderDimensions = () => {
	const body = document.body.style
	const logo = document.getElementById('logo').firstElementChild
	const tagline = document.getElementById('tagline')

	const logoHeightVar = '--logo--height'
	const taglineHeightVar = '--tagline--height'

	let logoHeight = logo.offsetHeight
	let taglineHeight = tagline.offsetHeight

	body.setProperty(logoHeightVar, ` ${logoHeight / 10}rem`)
	body.setProperty(taglineHeightVar, ` ${taglineHeight / 10}rem`)

	window.addEventListener('resize', () => {
		logoHeight = logo.offsetHeight
		taglineHeight = tagline.offsetHeight

		body.setProperty(logoHeightVar, ` ${logoHeight / 10}rem`)
		body.setProperty(taglineHeightVar, ` ${taglineHeight / 10}rem`)
	})
}

const scrollHeaderScale = () => {
	const main = document.querySelector('main')
	const mainClass = 'main--visible'

	const mainVisible = new IntersectionObserver(entries => {
		const [entry] = entries
		entry.isIntersecting ? document.body.classList.add(mainClass) : document.body.classList.remove(mainClass);
	})

	mainVisible.observe(main)
}



document.addEventListener('DOMContentLoaded', () => {
	getHeaderDimensions()
	scrollHeaderScale()
})