export default (html) => {

	let id = 0
	let rowIndex = -1

	const items = []
	const ref = (element, id) => ({
		id,
		text: element.innerText,
		...element.dataset
	})

	let rows = html.querySelectorAll('tr')
	if (!rows.length) {
		rows = [rows]
	}

	rows.forEach(tr => {
		rowIndex++

		if (!items[rowIndex]) {
			items[rowIndex] = []
		}

		let cellIndex = -1

		let cells = tr.querySelectorAll('th,td')
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
