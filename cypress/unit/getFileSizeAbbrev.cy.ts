/* eslint-disable no-magic-numbers */
import { getFileSizeAbbrev } from '../../src/components/input/multimodal/uploader/uploader'

describe('getFileSizeAbbrev', () => {
  const oneKBInBytes = 1024
  it('returns the correct file size abbreviation for bytes', () => {
    const lessThanOneKB = 1023
    expect(getFileSizeAbbrev(0)).to.equal('0 Bytes')
    expect(getFileSizeAbbrev(lessThanOneKB)).to.equal('1023 Bytes')
    expect(getFileSizeAbbrev(oneKBInBytes)).to.equal('1 KB')
    expect(getFileSizeAbbrev(oneKBInBytes * oneKBInBytes)).to.equal('1 MB')
    expect(
      getFileSizeAbbrev(oneKBInBytes * oneKBInBytes * oneKBInBytes)
    ).to.equal('1 GB')
    const two = 2
    expect(
      getFileSizeAbbrev(oneKBInBytes * oneKBInBytes * oneKBInBytes * two)
    ).to.equal('2 GB')
    const half = 0.5
    expect(getFileSizeAbbrev(oneKBInBytes * half)).to.equal('512 Bytes')
    expect(getFileSizeAbbrev(oneKBInBytes * oneKBInBytes * 1.4)).to.equal(
      '1.4 MB'
    )
    expect(
      getFileSizeAbbrev(oneKBInBytes * oneKBInBytes * oneKBInBytes * 3.5)
    ).to.equal('3.5 GB')
  })

  it('rounds up to the closest 0.1 decimal when converting KB to bytes', () => {
    const bytesBelow = 1.45 * oneKBInBytes
    cy.wrap(getFileSizeAbbrev(bytesBelow)).should('equal', '1.4 KB')

    const bytesAbove = 1.53 * oneKBInBytes
    cy.wrap(getFileSizeAbbrev(bytesAbove)).should('equal', '1.5 KB')
  })
})
