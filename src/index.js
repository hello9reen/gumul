import './default.css'

const Gumul = function (id) {

	// constructor
	const root = document.getElementById(id)

	const $ = (selector, context) => (context||root).querySelector(selector)

	if (!root) {
		throw `Seeking fail <div id="${id}" .../>`
	}

	this.def = {
		root,
		table: {
			head: null,
			body: null,
			left: null,
			cock: null
		},
		settings: Object.assign({}, root.dataset)
	}

	if (this.def.settings.sizes) {
		this.def.settings.sizes = JSON.parse(this.def.settings.sizes)
	}
}
Gumul.prototype.load = function() {
	console.log(this.def)
}


const test = new Gumul('test')
test.load()