import fetch from 'node-fetch'
import csvtojson from 'csvtojson'

const spreadsheetUrl = process.env.MEMBERS_URL

const data = async (req, res) => {
  const csvString = await fetch(spreadsheetUrl)
    .then(r => r.text())

  const json = await csvtojson().fromString(csvString)

  res.json(json)
}

export default data
