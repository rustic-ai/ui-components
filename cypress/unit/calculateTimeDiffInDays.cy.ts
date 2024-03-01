import { calculateTimeDiffInDays } from '../../src/components/helper'

describe('calculateTimeDiffInDays function', () => {
  it('calculates the time difference correctly for duration that is exactly 1 day', () => {
    const startTimestamp = 1627679200000
    const endTimestamp = 1627765600000

    const differenceInDays = calculateTimeDiffInDays(
      startTimestamp,
      endTimestamp
    )

    expect(differenceInDays).to.equal(1) // Expect the difference to be 1 day
  })

  it('calculates the time difference in days correctly for duration that is less than one day', () => {
    const startTimestamp = 1627679200000
    const endTimestamp = 1627686600000

    const differenceInDays = calculateTimeDiffInDays(
      startTimestamp,
      endTimestamp
    )

    expect(differenceInDays).to.lessThan(1)
  })

  it('calculates the time difference in days correctly for duration that is more than one day', () => {
    const startTimestamp = 1627679200000
    const endTimestamp = 1628687000000

    const differenceInDays = calculateTimeDiffInDays(
      startTimestamp,
      endTimestamp
    )

    expect(differenceInDays).to.greaterThan(1)
  })
})
