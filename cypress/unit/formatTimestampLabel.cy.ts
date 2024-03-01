import { formatTimestampLabel } from '../../src/components/helper'

/* eslint-disable no-magic-numbers */
describe('formatTimestampLabel function', () => {
  it('returns formatted timestamp for time difference less than or equal to 1 day', () => {
    const timestamp = 1709200800000
    const timeDiffInDays = 0.5

    const formattedLabel = formatTimestampLabel(timestamp, timeDiffInDays)

    expect(formattedLabel).to.equal('2:00 AM')
  })

  it('returns formatted timestamp for time difference equal to 1 day', () => {
    const timestamp = 1709200800000
    const timeDiffInDays = 1

    const formattedLabel = formatTimestampLabel(timestamp, timeDiffInDays)

    expect(formattedLabel).to.equal('2:00 AM')
  })

  it('returns formatted timestamp for time difference more than 1 day', () => {
    const timestamp = 1709200800000
    const timeDiffInDays = 2

    const formattedLabel = formatTimestampLabel(timestamp, timeDiffInDays)

    expect(formattedLabel).to.equal('Feb 29')
  })
})
