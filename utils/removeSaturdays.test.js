const removeSaturdays = require('./removeSaturdays')

describe('removeSaturdays', () => {
  it('removes all columns with saturdays', () => {
    const rows = [
      ['Namn', 'Född', '2019-10-08', '2019-10-12', '2019-10-13', '2019-10-19'],
      ['Amanda', null, '2(0)', '1(1)', '2(1)', '1(0)'],
      ['Adam', null, '2(2)', '1(0)', '2(0)', '1(2)'],
    ]
    const expected = [
      ['Namn', 'Född', '2019-10-08', '2019-10-13'],
      ['Amanda', null, '2(0)', '2(1)'],
      ['Adam', null, '2(2)', '2(0)'],
    ]

    const result = removeSaturdays(rows)

    expect(result).toEqual(expected)
  })
})
