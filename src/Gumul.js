import './default.css'

const Gumul = function (id) {
	const _root = document.getElementById(id)
	if (!_root) {
		throw `Seeking fail <div id="${id}" .../>`
	}

	// definition
	this.def = {
		root: _root,
		table: {
			head: null,
			body: null,
			left: null,
			cock: null
		},
		settings: Object.assign({}, _root.dataset)
	}

	const {root, table, settings} = this.def
	const $ = (selector, context) => {
		const element = (context||_root).querySelectorAll(selector)
		return element.length === 1 ? element[0] : element
	}

	// data-sizes convert to numbers
	if (settings.sizes) {
		settings.sizes = JSON.parse(settings.sizes)
	}

	// scaffolding initiative elements
	root.appendChild(table.head = document.createElement('div'))
	root.appendChild(table.body = document.createElement('div'))
	root.appendChild(table.left = document.createElement('div'))
	root.appendChild(table.cock = document.createElement('div'))
	table.head.classList.add('gumul-head')
	table.body.classList.add('gumul-body')
	table.left.classList.add('gumul-left')
	table.cock.classList.add('gumul-cock')

	console.log(getCells($('table>thead')))


	// private methods
	function getCells(html, isDataCell) {

		let id = 0
		let rowIndex = -1

		const items = []
		const ref = (element, id) =>
			isDataCell ? Object.assign({
					id
				},
				element.dataset)
				: ({
					id,
					text: element.innerText
				})

		let rows = $('tr', html)
		if (!rows.length) {
			rows = [rows]
		}

		rows.forEach(tr => {
			rowIndex++

			if (!items[rowIndex]) {
				items[rowIndex] = []
			}

			let cellIndex = -1

			let cells = $('th,td', tr)
			if (!cells.length) {
				cells = [cells]
			}

			cells.forEach(th => {
				id++
				cellIndex++

				const colSpan = parseInt(th.getAttribute('colSpan') || 1)
				const rowSpan = parseInt(th.getAttribute('rowSpan') || 1)

				if (colSpan > 1 && rowSpan > 1) {
					for (let i = 0; i < rowSpan; i++) {
						if (!items[rowIndex + i]) {
							items[rowIndex + i] = []
						}

						for (let j = 0; j < colSpan; j++) {
							while (items[rowIndex + i][cellIndex + j]) {
								cellIndex++
							}

							items[rowIndex + i][cellIndex + j] = ref(th, id)
						}
					}

					cellIndex += colSpan - 1
				}
				else if (colSpan > 1) {
					for (let i = 0; i < colSpan; i++) {
						while (items[rowIndex][cellIndex + i]) {
							cellIndex++
						}

						items[rowIndex][cellIndex + i] = ref(th, id)
					}

					cellIndex += colSpan - 1
				}
				else if (rowSpan > 1) {
					for (let i = 0; i < rowSpan; i++) {
						if (!items[rowIndex + i]) {
							items[rowIndex + i] = []
						}

						while (items[rowIndex + i][cellIndex]) {
							cellIndex++
						}

						items[rowIndex + i][cellIndex] = ref(th, id)
					}
				}
				else {
					if (!items[rowIndex]) {
						items[rowIndex] = []
					}

					while (items[rowIndex][cellIndex]) {
						cellIndex++
					}

					items[rowIndex][cellIndex] = ref(th, id)
				}
			})
		})

		return items
	}

	this.generated = (cells, isDataCell) => {

		let cid = -1
		const rows = []

		for (let i = 0; i < cells.length; i++) {

			const row = []

			for (let j = 0; j < cells[i].length; j++) {
				if (cells[i][j].id > cid) {
					cid = cells[i][j].id

					let colSpan = 0

					while (cells[i].length > j + ++colSpan
					&& cid === cells[i][j + colSpan].id) {
						//
					}

					let rowSpan = 0

					while (cells.length > i + ++rowSpan
					&& cid === cells[i + rowSpan][j].id) {
						//
					}

					const cell = Object.assign({}, cells[i][j])

					cell.children = cells[i][j].children
					if (colSpan > 1) cell.colSpan = colSpan
					if (rowSpan > 1) cell.rowSpan = rowSpan

					row.push(cell)
				}
			}

			rows.push(row)
		}

		return rows
	}
}
Gumul.prototype.load = function() {
	console.log(this.def.table.head)
}

export default Gumul



