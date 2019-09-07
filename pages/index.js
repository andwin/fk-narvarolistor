import React from 'react'
import fetch from 'node-fetch'
import listConfig from '../config/lists'
import Instructions from '../components/instructions'

import './index.scss'

class Page extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      list: null,
      members: null,
      texts: {},
    }

    this.selectList = this.selectList.bind(this)
  }

  componentDidMount() {
    fetch('/api/data')
      .then(r => r.json())
      .then((data) => {
        const members = data.members.sort((a, b) => (a.Efternamn || '').localeCompare(b.Efternamn))

        this.setState({
          members,
          texts: data.texts,
        })
      })
  }

  selectList(name) {
    const list = listConfig.find(l => l.name === name)
    this.setState({ list })
  }

  render() {
    const { list, members, texts } = this.state

    return (
      <>
        <nav>
          { listSelector(listConfig, this.selectList) }
        </nav>
        <main>
          { displayList(list, members, texts.info, texts.updated) }
          { !list && <Instructions /> }
        </main>
      </>
    )
  }
}

const listSelector = (lists, selectHandler) => {
  return (
    <>
      {lists.map(list => (
        <button key={id()} type="button" onClick={() => selectHandler(list.name)}>{list.name}</button>
      ))}
    </>
  )
}

const displayList = (list, members, infoText, updatedAt) => {
  if (!list || !members) return

  const coaches = members.filter(m => !!m.Tränare).map(m => ({
    Förnamn: m.Förnamn,
    Efternamn: m.Efternamn,
    Typ: 'Tränare',
  }))
  const listMembers = members.filter(m => !!m[list.name])

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
