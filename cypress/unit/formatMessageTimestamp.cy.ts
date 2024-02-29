import { formatMessageTimestamp } from '../../src/components/helper'

describe('formatTimestamp', () => {
  beforeEach(() => {
    cy.clock(new Date('2023-01-02T12:00:00Z').getTime(), ['Date'])
  })

  it('returns time difference for timestamps within a day', () => {
    const result = formatMessageTimestamp('2023-01-01T12:00:01Z')
    expect(result).to.contain('ago')
  })

  it('should return date and time when time difference is more than 24 hours', () => {
    const utcTimestamp = '2021-01-01T00:00:00Z'
    const expected = 'Dec 31 2020 4:00 PM'
    const result = formatMessageTimestamp(utcTimestamp)
    expect(result).to.eq(expected)
  })
})
