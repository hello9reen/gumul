export default (cells) => {
	let cid = -1

	const tbody = document.createElement('tbody')

	for (let i = 0; i < cells.length; i++) {
		const row = document.createElement('tr')

		for (let j = 0; j < cells[i].length; j++) {
			if (cells[i][j].id > cid) {
				cid = cells[i][j].id

				let colSpan = 0
				while (cells[i].length > j + ++colSpan && cid === cells[i][j + colSpan].id) {
					//
				}

				let rowSpan = 0
				while (cells.length > i + ++rowSpan && cid === cells[i + rowSpan][j].id) {
					//
				}

				row.appendChild(createTd(cells[i][j], rowSpan, colSpan))
			}
		}

		tbody.appendChild(row)
	}

	return tbody
}

function createTd(_td, rowSpan, colSpan) {
	const {text, id, ...dataset} = _td
	const td = document.createElement('td')
	td.appendChild(document.createTextNode(text))

	Object.keys(dataset).map(key => td.setAttribute('data-' + key, dataset[key]))

	if (rowSpan > 1) {
		td.setAttribute('rowSpan', rowSpan)
	}

	if (colSpan > 1) {
		td.setAttribute('colSpan', colSpan)
	}

	return td
}