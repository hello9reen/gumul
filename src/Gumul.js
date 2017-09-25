import utils from './utils'
import $ from 'jquery'

import './default.css'

const Gumul = function (id) {
	const $root = $(`#${id}`)

	if (!$root) {
		throw `Seeking fail <div id="${id}" ...`
	}



	// definition
	this.def = {
		root: $root,
		cell: {
			thead: utils.defineCells($('>table>thead',$root)),
			tbody: utils.defineCells($('>table>tbody',$root))
		},
		form: {
			body: null,
			left: null
		},
		head: $('<div/>').addClass('gumul-head'),
		body: $('<div/>').addClass('gumul-body'),
		left: $('<div/>').addClass('gumul-left'),
		cock: $('<div/>').addClass('gumul-cock'),
		hide: [],
		fix: 0,
		...$root.data()
	}

	// remove defined-table element
	$('>table',$root).remove()

	// initiative elements
	const {head, body, left, cock} = this.def
	$root.append(cock, head, left, body)

	//
	this.frameBuild()
}
Gumul.prototype.frameBuild = function () {
	const {root, head, body, cock, left, cell, ...def} = this.def
	const width = {
		left: def.size.map(i => def.hide.includes(i) ? 0 : i).slice(0, def.fix).reduce((a,b) => a + b),
		body: def.size.map(i => def.hide.includes(i) ? 0 : i).slice(def.fix).reduce((a,b) => a + b)
	}

	// generate new table
	if (def.fix) {
		this.def.form.body = utils.generateTbody(cell.tbody, def.hide, def.fix)
		body.colgroup = utils.generateColgroup(def.size, def.hide, def.fix)
		body.table = $('<table/>').append(body.colgroup).width(width.body)
		body.table.append(this.def.form.body)
		body.append(body.table)

		this.def.form.left = utils.generateTbody(cell.tbody, def.hide, 0, def.fix)
		left.colgroup = utils.generateColgroup(def.size, def.hide, 0, def.fix)
		left.table = $('<table/>').append(left.colgroup).width(width.left)
		left.table.append(this.def.form.left)
		left.append(left.table, left.colgroup)

		head.colgroup = utils.generateColgroup(def.size, def.hide)
		head.table = $('<table/>').append(head.colgroup).width(width.left + width.body)
		head.table.append(utils.generateThead(cell.thead, def.hide))
		head.append(head.table)

		cock.table = head.table.clone(true)
		cock.append(cock.table)

		setTimeout(() => {
			cock.width(width.left)
			left.width(width.left)
			head.width(root.width() - width.left)
			body.width(root.width() - width.left)

			head.table.css('margin-left', -(width.left))
		})
	}
	else {
		// TODO no fixed
	}

	// scroll propagation
	body.on('scroll', e => {
		head.table.css('margin-left', e.target.scrollLeft * -1)
	})

	// complete
	setTimeout(() => root.addClass('on-started'), 100)

}
Gumul.prototype.load = function () {
}

export default Gumul



