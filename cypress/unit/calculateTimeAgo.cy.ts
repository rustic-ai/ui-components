import { calculateTimeAgo } from '../../src/components/helper'

describe('calculateTimeAgo', () => {
  beforeEach(() => {
    cy.clock(new Date('2023-01-02T12:00:00Z').getTime())
  })

  it('returns seconds ago for timestamps within one minute', () => {
    expect(calculateTimeAgo('2023-01-02T11:59:10Z')).to.eq('50 seconds ago')
  })
  it('returns mins ago for timestamps within one hour', () => {
    expect(calculateTimeAgo('2023-01-02T11:30:00Z')).to.eq('30 minutes ago')
  })
  it('returns hours ago for timestamps within a day', () => {
    expect(calculateTimeAgo('2023-01-02T02:00:00Z')).to.eq('10 hours ago')
  })
  it('returns 1 second ago when the difference is equal to one second', () => {
    expect(calculateTimeAgo('2023-01-02T11:59:59Z')).to.eq('1 second ago')
  })
  it('returns 1 min ago when the difference is equal to one minute', () => {
    expect(calculateTimeAgo('2023-01-02T11:59:00Z')).to.eq('1 minute ago')
  })
  it('returns 1 hour ago when the difference is equal to one hour', () => {
    expect(calculateTimeAgo('2023-01-02T11:00:00Z')).to.eq('1 hour ago')
  })
})
