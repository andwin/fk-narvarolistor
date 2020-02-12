import React, { useState, useEffect } from 'react'
import fetch from 'node-fetch'
import listConfig from '../config/lists'
import Instructions from '../components/instructions'

import './index.scss'

const Page = () => {
  const [listName, setListName] = useState()
  const [members, setMembers] = useState()
  const [texts, setTexts] = useState({})

  useEffect(() => {
    fetchData(setMembers, setTexts)
  }, [])

  const list = listConfig.find(l => l.name === listName)

  return (
    <>
      <nav>
        { listSelector(listConfig, setListName) }
      </nav>
      <main>
        { displayList(list, members, texts.info, texts.updated) }
        { !list && <Instructions /> }
      </main>
    </>
  )
}

const fetchData = (setMembers, setTexts) => {
  fetch('/api/data')
    .then(r => r.json())
    .then((data) => {
      const sortedMembers = data.members.sort((a, b) => (a.Efternamn || '').localeCompare(b.Efternamn))

      setMembers(sortedMembers)
      setTexts(data.texts)
    })
}

const listSelector = (lists, selectHandler) => (
  <>
    {lists.map(list => (
      <button key={id()} type="button" onClick={() => selectHandler(list.name)}>{list.name}</button>
    ))}
  </>
)

const displayList = (list, members, infoText, updatedAt) => {
  if (!list || !members) return

  const coaches = members.filter(m => !!m.Tränare).map(m => ({
    Förnamn: m.Förnamn,
    Efternamn: m.Efternamn,
    Typ: 'Tränare',
  }))
  const listMembers = members.filter(m => m[list.name].trim().toLowerCase() === 'x')
  const narrowColumns = ['Reg.', 'Bet.', '']

  return (
    <>
      <p className="today">Datum:</p>
      <h1>{list.name}</h1>
      <p className="info-text">{infoText}</p>
      <p className="updated-at">Uppdaterad: {updatedAt}</p>
      <table>
        <thead>
          <tr>
            {list.columns.map((column) => {
              const className = narrowColumns.includes(column) ? 'narrow' : null
              return <th key={id()} className={className}>{column}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {list.includeCoaches && displayListRows(coaches, list.columns, 'coach')}
          {displayListRows(listMembers, list.columns)}
        </tbody>
      </table>
    </>
  )
}

const displayListRows = (members, columns, className = null) => (
  <>
    {members.map(member => (
      <tr key={id()} className={className}>
        {columns.map(column => (
          <td key={id()}>{member[column]}</td>
        ))}
      </tr>
    ))}
  </>
)

const id = () => Math.random().toString(36).substr(2, 9)

export default Page
