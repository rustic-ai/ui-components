import { formatDurationTime } from '../../src/components/helper'

describe('formatDurationTime', () => {
  it('should show 3 digits if the duration is less than 10 seconds', () => {
    const durationTimeInSeconds = 5

    const formatted = formatDurationTime(durationTimeInSeconds)
    expect(formatted).to.eq('0:05')
  })

  it('should show 3 digits if the duration is between is less than 10 minutes', () => {
    // 1 minute
    const durationTimeInSeconds = 60

    const formatted = formatDurationTime(durationTimeInSeconds)
    expect(formatted).to.eq('1:00')
  })

  it('should show 5 digits if the duration is between is less than 10 hours', () => {
    // 1 hour
    const durationTimeInSeconds = 3600

    const formatted = formatDurationTime(durationTimeInSeconds)
    expect(formatted).to.eq('1:00:00')
  })
})
