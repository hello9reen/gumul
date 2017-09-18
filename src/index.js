import './default.css'

function component() {
	const element = document.createElement('div')
	element.classList.add('gumul')

	console.log(element)	
	return element
}

document.body.appendChild(component())


// HMR (Hot Module Replacement)
if (module.hot) {
	module.hot.accept('./index.js', function () {
		console.log('updated!')
	})
}