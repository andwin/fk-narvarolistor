import React from 'react'
import fetch from 'node-fetch'

import './index.scss'

const listConfig = [
  {
    name: 'Barngrupp 1',
    includeCoaches: true,
    columns: ['Reg.', 'Bet.', 'Typ', 'Moon', 'Förnamn', 'Efternamn', 'Mobilnummer', ''],
  },
  {
    name: 'Barngrupp 2',
    includeCoaches: true,
    columns: ['Reg.', 'Bet.', 'Typ', 'Moon', 'Förnamn', 'Efternamn', 'Mobilnummer', ''],
  },
  {
    name: 'Nybörjare',
    includeCoaches: true,
    columns: ['Reg.', 'Bet.', 'Förnamn', 'Efternamn', 'Mobilnummer', ''],
  },
  {
    name: 'Ungdomar',
    includeCoaches: true,
    columns: ['Reg.', 'Bet.', 'Förnamn', 'Efternamn', 'Mobilnummer', ''],
  },
  {
    name: 'Vuxna',
    includeCoaches: false,
    columns: ['Reg.', 'Bet.', 'Förnamn', 'Efternamn', 'Mobilnummer', ''],
  },
]

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
        </main>
      </>
    )
  }
}

const listSelector = (lists, selectHandler) => {
  return (
    <div>
      {lists.map(list => (
        <button key={id()} type="button" onClick={() => selectHandler(list.name)}>{list.name}</button>
      ))}
    </div>
  )
}

const displayList = (list, members, infoText, updatedAt) => {
  if (!list || !members) return

  const coaches = members.filter(m => !!m.Tränare)
  const listMembers = members.filter(m => !!m[list.name])

  return (
    <>
      <p className="today">Datum:</p>
      <h1>{list.name}</h1>
      <p className="info-text">{infoText}</p>
      <p className="updated-at">Uppdaterad: {updatedAt}</p>
      <table>
        <thead>
          <tr>
            {list.columns.map(column => (
              <th key={id()}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.includeCoaches && displayListRows(coaches, list.columns, true)}
          {displayListRows(listMembers, list.columns)}
        </tbody>
      </table>
    </>
  )
}

const displayListRows = (members, columns, coaches = false) => {
  const style = coaches ? 'coach' : ''

  let emptyLine = null
  if (coaches) {
    members = members.map(m => ({ Förnamn: m.Förnamn, Efternamn: m.Efternamn }))
    emptyLine = (
      <tr key={id()}>
        {columns.map(() => (
          <td key={id()}>&nbsp;</td>
        ))}
      </tr>
    )
  }

  return (
    <>
      {members.map(member => (
        <tr key={id()} className={style}>
          {columns.map(column => (
            <td key={id()}>{member[column]}</td>
          ))}
        </tr>
      ))}
      {emptyLine}
    </>
  )
}

const id = () => Math.random().toString(36).substr(2, 9)

export default Page
