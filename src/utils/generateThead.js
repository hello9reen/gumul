export default (cells, hide) => {
	let cid = -1

	const thead = document.createElement('thead')

	for (let i = 0; i < cells.length; i++) {
		const row = document.createElement('tr')

		for (let j = 0; j < cells[i].length; j++) {
			if (!hide.includes(j)) {
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

					row.appendChild(createTh(cells[i][j].text, rowSpan, colSpan))
				}
			}
		}

		thead.appendChild(row)
	}

	return thead
}

function createTh(text, rowSpan, colSpan) {
	const th = document.createElement('th')
	th.appendChild(document.createTextNode(text))

	if (rowSpan > 1) {
		th.setAttribute('rowSpan', rowSpan)
	}

	if (colSpan > 1) {
		th.setAttribute('colSpan', colSpan)
	}

	return th
}