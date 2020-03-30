import fetch from 'node-fetch'
import csvtojson from 'csvtojson'

const membersUrl = process.env.MEMBERS_URL
const textsUrl = process.env.TEXTS_URL

const data = async (req, res) => {
  const membersCsv = await fetch(membersUrl)
    .then(r => r.text())
  const members = await csvtojson().fromString(membersCsv)

  const textsCsv = await fetch(textsUrl)
    .then(r => r.text())

  const texts = {}
  const rawTets = await csvtojson().fromString(textsCsv)
  rawTets.forEach((t) => {
    if (t.key) texts[t.key] = t.value
  })

  const json = {
    members,
    texts,
  }

  res.json(json)
}

export default data
