import './default.css'

import utils from './utils'
import generateColgroup from './utils/generateColgroup'

const Gumul = function (id) {
	const _root = document.getElementById(id)
	if (!_root) {
		throw `Seeking fail <div id="${id}" ...`
	}

	// definition
	this.def = {
		root: _root,
		cells: {
			head: utils.defineCells(_root.querySelector('table>thead')),
			body: utils.defineCells(_root.querySelector('table>tbody'))
		},
		forms: {
			row: null
		},
		element: {
			head: null,
			body: null,
			left: null,
			cock: null
		},
		settings: {..._root.dataset}
	}

	const {root, cells, element, settings} = this.def

	// scaffolding initiative elements
	root.appendChild(element.head = document.createElement('div'))
	root.appendChild(element.body = document.createElement('div'))
	root.appendChild(element.left = document.createElement('div'))
	root.appendChild(element.cock = document.createElement('div'))
	element.head.classList.add('gumul-head')
	element.body.classList.add('gumul-body')
	element.left.classList.add('gumul-left')
	element.cock.classList.add('gumul-cock')

	// remove defined-table element
	root.removeChild(root.querySelector('table'))


	// generate new table
	const _colgroup = generateColgroup(settings.size)
	const _table = document.createElement('table')
	_table.style.width = _colgroup.dataset.size + 'px'
	_table.appendChild(_colgroup)

	element.head.table = _table.cloneNode(true)
	element.head.table.appendChild(utils.generateThead(cells.head))
	element.head.appendChild(element.head.table)

	element.body.table = _table.cloneNode(true)
	element.body.table.appendChild(utils.generateTbody(cells.body))
	element.body.appendChild(element.body.table)

	// scroll propagation
	element.body.addEventListener('scroll', e => {
		element.head.table.style.marginLeft = (e.target.scrollLeft * -1) + 'px'
		console.log(e.target.scrollTop)
		setTimeout(() => e.target.scrollTop = 20, 200)
	})
}
Gumul.prototype.load = function() {
}

export default Gumul



