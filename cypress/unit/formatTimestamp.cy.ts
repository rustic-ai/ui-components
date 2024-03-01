import { formatTimestamp, TimeFormat } from '../../src/components/helper'

describe('formatTimestamp', () => {
  it("should return a string representing the time in the user's locale", () => {
    const timestamp = 1634567890000
    const format = TimeFormat.HOUR
    const result = formatTimestamp(timestamp, format)
    expect(typeof result).to.eq('string')
  })

  it("should return a string with the hour and minute in the user's locale when format is TimeFormat.HOUR", () => {
    const timestamp = 1634567890000
    const format = TimeFormat.HOUR
    const result = formatTimestamp(timestamp, format)
    expect(result).to.match(/\d{1,2}:\d{2}\s(AM|PM)/)
  })

  it("should return a string with the month and date in the user's locale when format is TimeFormat.MONTH_DATE", () => {
    const timestamp = 1634567890000
    const format = TimeFormat.MONTH_DATE
    const result = formatTimestamp(timestamp, format)
    expect(result).to.match(/[A-Za-z]{3}\s\d{1,2}/)
  })
})
