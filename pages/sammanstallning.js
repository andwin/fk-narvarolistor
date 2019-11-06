import React, { useState } from 'react'
import readXlsxFile from 'read-excel-file'
import removeSaturdays from '../utils/removeSaturdays'

const Page = () => {
  const [data, setData] = useState({})

  const onChange = async (e) => {
    const res = await process(e.target.files[0])
    setData(res)
  }

  return (
    <main>
      <input type="file" id="input" onChange={onChange} />
      {renderStatistics(data)}
    </main>
  )
}

const process = async (file) => {
  const rows = await readXlsxFile(file)
  const filteredRows = removeSaturdays(rows)

  const firstRow = filteredRows.shift()
  const firstDate = getFirstDate(firstRow)
  const lastDate = getLastDate(firstRow)

  const members = filteredRows.map(getMemberStatistics)

  return {
    firstDate,
    lastDate,
    members,
  }
}

const getFirstDate = row => row.reduce((prev, curr) => {
  const d = Date.parse(curr)
  if (!d || d > Date.parse(prev)) return prev
  return curr
})

const getLastDate = row => row.reduce((prev, curr) => {
  const d = Date.parse(curr)
  if (!d || d < Date.parse(prev)) return prev
  return curr
})

const getMemberStatistics = (row) => {
  const name = row.shift()

  const count = row.reduce((prev, curr) => {
    if (!curr) return prev
    return prev + parseValue(curr)
  }, 0)

  return {
    name,
    count,
  }
}

const parseValue = (val) => {
  const match = val.match(/\((\d)\)/)
  if (!match) return 0

  return +match[1]
}

const renderStatistics = (data) => {
  const { firstDate, lastDate, members } = data
  if (!members) return null

  return (
    <>
      <p>Från {firstDate} till {lastDate}</p>
      <table>
        <thead>
          <tr><th>Namn</th><th>Antal pass</th></tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.name}>
              <td>{m.name}</td>
              <td>{m.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Page
