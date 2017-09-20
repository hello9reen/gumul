export default (sizes) => {
	const colgroup = document.createElement('colgroup')

	let _sizes = null
	if (/^\[[0-9, ]+]$/.test(sizes)) {
		_sizes = JSON.parse(sizes.replace(/\s/g, ''))
	}
	else if (/^[0-9, ]+$/.test(sizes)) {
		_sizes = sizes.replace(/\s/g, '').split(',')
	}

	if (_sizes) {
		_sizes.forEach(size => {
			const col = document.createElement('col')
			col.setAttribute('width', size)
			colgroup.appendChild(col)
		})

		colgroup.dataset.size = _sizes.reduce((a, b) => a + b)
	}

	return colgroup
}