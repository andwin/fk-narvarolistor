const removeSaturdays = (rows) => {
  const firstRow = rows[0]
  const filteredRows = []
  rows.forEach(() => filteredRows.push([]))

  firstRow.forEach((col, i) => {
    const date = new Date(Date.parse(col))

    if (date && date.getDay() === 6) return

    rows.forEach((row, c) => {
      filteredRows[c].push(row[i])
    })
  })

  return filteredRows
}

module.exports = removeSaturdays
