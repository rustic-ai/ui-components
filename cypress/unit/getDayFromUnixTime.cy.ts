import { getDayFromUnixTime } from '../../src/components/helper'

describe('getDayFromUnixTime', () => {
  it('Returns the correct day for a given unix time', () => {
    // Tuesday, January 4th 2022, 11:20:00 pm
    const unixTime = 1641367200

    const expected = {
      shortName: 'Tues',
      fullName: 'Tuesday',
    }

    const result = getDayFromUnixTime(unixTime)

    expect(result.shortName).to.equal(expected.shortName)
    expect(result.fullName).to.equal(expected.fullName)
  })

  it('Returns the correct day at a minute before midnight', () => {
    const unixTime = 1704182399 // Monday, January 1st 2024, 11:59:59 pm
    const result = getDayFromUnixTime(unixTime)
    expect(result.shortName).to.equal('Mon')
    expect(result.fullName).to.equal('Monday')
  })

  it('Returns the correct day at midnight', () => {
    const unixTime = 1704182400 // Tuesday, January 2st 2024, 12:00:00 am
    const result = getDayFromUnixTime(unixTime)
    expect(result.shortName).to.equal('Tues')
    expect(result.fullName).to.equal('Tuesday')
  })

  it('Returns the correct day a minute after midnight', () => {
    const unixTime = 1704182401 // Tuesday, January 2st 2024, 12:00:01 am
    const result = getDayFromUnixTime(unixTime)
    expect(result.shortName).to.equal('Tues')
    expect(result.fullName).to.equal('Tuesday')
  })
})
