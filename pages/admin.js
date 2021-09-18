import React, { useState, useEffect } from 'react'
import fetch from 'node-fetch'
import listConfig from '../config/lists'

const Admin = () => {
  const [members, setMembers] = useState()
  const [duplicates, setDuplicates] = useState([])
  const [missingPayment, setMissingPayment] = useState([])
  const [notInList, setNotInList] = useState([])

  useEffect(() => {
    fetchData(setMembers)
  }, [])

  useEffect(() => {
    if (!members) return

    const membersDuplicates = members.filter((m) => {
      const findDuplicate = m2 => m.Förnamn === m2.Förnamn && m.Efternamn === m2.Efternamn
      return members.filter(findDuplicate).length > 1
    })
    setDuplicates(membersDuplicates)

    const listNames = listConfig.map(l => l.name)
    const membersNotInList = members.filter(m => !listNames.some(l => m[l].trim().toLowerCase() === 'x'))
    setNotInList(membersNotInList)

    const paymentOkStatus = ['x', 'ok']
    const membersMissingPayment = members.filter(m => !paymentOkStatus.includes(m['Bet.'].trim().toLowerCase()))
    setMissingPayment(membersMissingPayment)
  }, [members])

  return (
    <>
      <nav>
        <a href="/">🔙</a>
      </nav>
      <main>
        <h1>Dubbletter</h1>
        <p>{duplicates.length} st</p>
        { displayList(duplicates) }

        <h1>Inte med i någon lista</h1>
        <p>{notInList.length} st</p>
        { displayList(notInList) }

        <h1>Betalning saknas</h1>
        <p>{missingPayment.length} st</p>
        { displayList(missingPayment) }
      </main>
    </>
  )
}

const fetchData = (setMembers) => {
  fetch('/api/data')
    .then(r => r.json())
    .then((data) => {
      const sortedMembers = data.members.sort((a, b) => (a.Efternamn || '').localeCompare(b.Efternamn))

      setMembers(sortedMembers)
    })
}

const displayList = (list) => {
  if (!list || !list.length) return null

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Förnamn</th><th>Efternamn</th><th>Telefon</th>
          </tr>
        </thead>
        <tbody>
          {list.map(member => (
            <tr key={id()}>
              <td>{member['Förnamn']}</td>
              <td>{member.Efternamn}</td>
              <td>{member.Mobilnummer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

const id = () => Math.random().toString(36).substr(2, 9)

export default Admin
