import React from 'react'
import fetch from 'node-fetch'

import './index.scss'

const listConfig = [
  {
    name: 'Barngrupp 1',
    includeCoaches: true,
    columns: ['Registrerad', 'Betalt', 'Typ', 'Moon', 'Förnamn', 'Efternamn', 'Mobilnummer', ''],
  },
  {
    name: 'Barngrupp 2',
    includeCoaches: true,
    columns: ['Registrerad', 'Betalt', 'Typ', 'Moon', 'Förnamn', 'Efternamn', 'Mobilnummer', ''],
  },
  {
    name: 'Nybörjare',
    includeCoaches: true,
    columns: ['Registrerad', 'Betalt', 'Förnamn', 'Efternamn', 'Mobilnummer', ''],
  },
  {
    name: 'Ungdomar',
    includeCoaches: true,
    columns: ['Registrerad', 'Betalt', 'Förnamn', 'Efternamn', 'Mobilnummer', ''],
  },
  {
    name: 'Vuxna',
    includeCoaches: false,
    columns: ['Registrerad', 'Betalt', 'Förnamn', 'Efternamn', 'Mobilnummer', ''],
  },
]

class Page extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      list: null,
      members: null,
    }

    this.selectList = this.selectList.bind(this)
  }

  componentDidMount() {
    fetch('/api/data')
      .then(r => r.json())
      .then((members) => {
        members = members.sort((a, b) => (a.Efternamn || '').localeCompare(b.Efternamn))

        this.setState({ members })
      })
  }

  selectList(name) {
    const list = listConfig.find(l => l.name === name)
    this.setState({ list })
  }

  render() {
    const { list, members } = this.state

    return (
      <div>
        { listSelector(listConfig, this.selectList) }
        { displayList(list, members) }
      </div>
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

const displayList = (list, members) => {
  if (!list || !members) return

  const coaches = members.filter(m => !!m.Tränare)
  const listMembers = members.filter(m => !!m[list.name])

  return (
    <>
      <h1>{list.name}</h1>
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

  if (coaches) {
    members = members.map(m => ({ Förnamn: m.Förnamn, Efternamn: m.Efternamn }))
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
    </>
  )
}

const id = () => Math.random().toString(36).substr(2, 9)

export default Page
