import $ from 'jquery'

export default (sizes, hide, start = 0, end = sizes.length) => {
	const colgroup = $('<colgroup/>')

	let _sizes = sizes.slice(start, end)

	if (hide && hide.length > 0) {
		hide.forEach(index => {
			_sizes = _sizes.slice(0, index).concat(_sizes.slice(index + 1))
		})
	}

	_sizes.forEach(size => {
		colgroup.append($('<col/>').width(size))
	})

	return colgroup
}