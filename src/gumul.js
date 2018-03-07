import './utils/addWheelListener'

import './gumul.scss'

export default class Gumul {
	constructor (id) {
		const $root = document.getElementById(id)

		if (!$root) {
			throw `Seeking fail <div id="${id}" ...`
		}

		// definitions
		this.def = {
			root: $root,
			main: document.createElement('div'),
			head: document.createElement('div'),
			cock: null,
			left: null,
			form: null,
			fix:  0,
			fixedLength: 0,
			size: [],
			load: {
				data: [],
				page: {},
				sort: []
			},
			...$root.dataset
		}

		this.def.main.classList.add('gumul-main')
		this._render()
	}
	_render () {
		const {root} = this.def

		let table = root.querySelector('table')

		this._initialize(table)
		this._alignment()
	}
	_initialize (table) {
		const {root, fix, uri} = this.def

		// count horizon cell
		let cellSize = 0
		table.querySelector('thead>tr').querySelectorAll('th,td').forEach(cell => {
			cellSize += parseInt(cell.getAttribute('colSpan') || 1)
		})

		let colgroup = table.querySelector('colgroup')
		if (!colgroup) {
			colgroup = document.createElement('colgroup')
			table.appendChild(colgroup)
		}

		let cols = colgroup.querySelectorAll('col')
		for (let i = 0; i < cellSize; i++) {
			let col = cols[i]
			if (!col) {
				col = document.createElement('col')
				col.setAttribute('width', '100')
				colgroup.appendChild(col)
			}

			this.def.size[i] = parseInt(col.style.width || col.getAttribute('width')) || 100
		}

		if (cols.length > this.def.size.length) {
			for (let i = cols.length - 1; i === this.def.size.length; i--) {
				colgroup.removeChild(cols[i])
			}
		}

		const headTable = table.cloneNode(true)
		headTable.querySelectorAll('tbody').forEach(t => headTable.removeChild(t))

		this._sortable(headTable)

		if (fix > 0) {
			this.def.cock = document.createElement('div')
			this.def.cock.classList.add('gumul-cock')
			this.def.cock.appendChild(this._sortable(headTable.cloneNode(true)))
			root.appendChild(this.def.cock)
		}

		this.def.head = document.createElement('div')
		this.def.head.classList.add('gumul-head')
		this.def.head.appendChild(headTable)
		root.appendChild(this.def.head)


		table.removeChild(table.querySelector('thead'))
		if (uri) {
			let tbody = table.querySelector('tbody')
			this.def.form = tbody.cloneNode(true)
			table.removeChild(tbody)
		}

		if (fix > 0) {
			this.def.left = document.createElement('div')
			this.def.left.classList.add('gumul-left')
			this.def.left.appendChild(table.cloneNode(true))
			root.appendChild(this.def.left)
		}

		this.def.main = document.createElement('div')
		this.def.main.classList.add('gumul-main')
		this.def.main.appendChild(table)
		root.appendChild(this.def.main)

		if (fix > 0) {
			window.addWheelListener(root, e => {
				this.def.main.scrollLeft += 2 * e.deltaX
				this.def.main.scrollTop += 2 * e.deltaY
			})
		}

		this.def.main.addEventListener('scroll', () => {
			this.def.head.style.marginLeft = (this.def.main.scrollLeft * -1) + 'px'

			if (fix > 0) {
				this.def.left.querySelector('table').style.marginTop =
					(this.def.main.scrollTop * -1) + 'px'
			}
		})

		this.def.size.forEach((size, index) => {
			let resizer = document.createElement('div')
			resizer.classList.add('gumul-resizer')
			resizer.dataset.index = index
			resizer.addEventListener('mousedown', e => {
				if (root.classList.contains('gumul-resizing')) {
					return
				}
				else {
					root.classList.add('gumul-resizing')
				}

				let elem = e.target
				let fn = {
					move: e => {
						e.stopPropagation()
						e.preventDefault()

						fn.distance = e.pageX - fn.startX
						fn.target.style.left = (fn.left + fn.distance) + 'px'
					},
					fire: () => {
						const index = parseInt(fn.target.dataset.index)
						let width = this.def.size[index] += fn.distance

						if (width < 10 || !width) {
							width = this.def.size[index] = 10
						}

						root.querySelectorAll('colgroup>col:nth-child(' + (index + 1) + ')')
							.forEach(el => el.setAttribute('width', width))

						root.removeEventListener('mousemove', fn.move)
						root.removeEventListener('mouseup', fn.fire)

						fn.target.classList.remove('gumul-resizer-grab')
						root.classList.remove('gumul-resizing')

						this._alignment()
					}
				}

				fn.target = elem
				fn.startX = e.pageX
				fn.left = parseInt(resizer.style.left)

				elem.classList.add('gumul-resizer-grab')

				root.addEventListener('mousemove', fn.move)
				root.addEventListener('mouseup', fn.fire)
			})

			if (index < fix) {
				this.def.cock.appendChild(resizer)
			}
			else {
				this.def.head.appendChild(resizer)
			}
		})
	}
	_alignment () {
		const {root, main, left, cock, head, fix, size} = this.def
		const headHeight = head.offsetHeight

		if (fix > 0) {
			const fixedLength = size.slice(0, fix).reduce((a, b) => a + b)

			cock.style.width = fixedLength + 'px'
			left.style.width = fixedLength + 'px'
			left.style.marginTop = headHeight + 'px'
			main.style.marginLeft = fixedLength + 'px'
			main.querySelector('table').style.marginLeft = (fixedLength * -1) + 'px'
		}

		main.style.marginTop = headHeight + 'px'
		main.style.height = (root.offsetHeight - headHeight) + 'px'

		let length = 0
		const resizer = root.querySelectorAll('.gumul-resizer')

		size.forEach((width, index) => {
			resizer[index].style.left = (length += width) + 'px'
		})
	}
	_sortable (table) {
		const {load} = this.def

		table.querySelectorAll('th[data-name]').forEach(th => {
			th.addEventListener('click', () => {
				let sub = th.querySelector('.sorted')

				if (sub) {
					sub.classList.toggle('desc')
					sub.classList.toggle('asc')
				}
				else {
					sub = document.createElement('sub')
					sub.classList.add('sorted', 'asc')

					load.sort.push({
						name: th.getAttribute('data-name'),
						element: sub
					})

					sub.innerHTML = load.sort.length

					sub.addEventListener('mouseover', () => {
						sub.title = sub.innerHTML
						sub.innerHTML = 'DELETE'
					})
					sub.addEventListener('mouseout', () => {
						sub.innerHTML = sub.title
						sub.title = ''
					})
					sub.addEventListener('click', e => {
						const i = parseInt(sub.getAttribute('title')) - 1

						load.sort = load.sort.slice(0, i).concat(load.sort.slice(i + 1))
						load.sort.forEach((i, index) => i.element.innerHTML = index + 1)

						sub.parentNode.removeChild(sub)
						e.stopPropagation()
					})

					th.appendChild(sub)
				}
			})
		})

		return table
	}


	load (page = 1) {
		const {uri, load} = this.def

		load.data = []

		let params = ''

		if (load.sort.length > 0) {
			if (uri.indexOf('?') < 0) {
				params += '?'
			}

			load.sort.forEach(item => {
				params += '&sort=' + item.name + ','
				params += item.element.classList.contains('desc') ? 'desc' : 'asc'
			})
		}

		fetch(uri + params, {
			body: {
				page
			}
		})
			.then(res => res.json())
			.then(res => this._append(load.data = res))
	}
	_append (data) {
		const {left, main, fix, form} = this.def
		const table = main.querySelector('table')

		table.querySelectorAll('tbody').forEach(t => t.parentNode.removeChild(t))

		data.forEach(record => {
			const row = form.cloneNode(true)

			row.querySelectorAll('th[data-name],td[data-name]')
				.forEach(col => {
					let value = null

					if (!/\./.test(col.dataset.name)) {
						value = record[col.dataset.name]
					}
					else {
						value = record
						col.dataset.name.split('.')
							.map(name => value = value[name])
					}

					col.appendChild(document.createTextNode(value))
				})

			table.appendChild(row)
		})



		if (fix > 0) {
			const leftTable = left.querySelector('table')
			leftTable.querySelectorAll('tbody')
				.forEach(t => t.parentNode.removeChild(t))
			table.querySelectorAll('tbody')
				.forEach(t => leftTable.appendChild(t.cloneNode(true)))
		}
	}
}
