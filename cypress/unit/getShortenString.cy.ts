import { getShortenString } from '../../src/components/helper'

describe('getShortenString', () => {
  it('returns the original string if it is shorter than maxLength', () => {
    const str = 'Hello, world!'
    const maxLength = 15

    cy.wrap(getShortenString(str, maxLength)).should('equal', str)
  })

  it('returns the original string if it is equal to maxLength', () => {
    const str = 'This is the maximum length'
    const maxLength = str.length

    cy.wrap(getShortenString(str, maxLength)).should('equal', str)
  })

  it('shortens the string and adds ellipsis if it is longer than maxLength', () => {
    const str = 'This is a long string that needs to be shortened'
    const maxLength = 20

    const expectedShortenedString = 'This is a long st...'

    cy.wrap(getShortenString(str, maxLength)).should(
      'eq',
      expectedShortenedString
    )
  })

  it('handles empty string correctly', () => {
    const str = ''
    const maxLength = 10

    cy.wrap(getShortenString(str, maxLength)).should('equal', '')
  })
})
