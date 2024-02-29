import { capitalizeFirstLetter } from '../../src/components/helper'

describe('capitalizeFirstLetter', () => {
  it('should return a string with the first letter capitalized', () => {
    expect(capitalizeFirstLetter('hello')).to.eq('Hello')
  })

  it('should not change the string if the first character is not a letter', () => {
    expect(capitalizeFirstLetter('1')).to.eq('1')
  })

  it('should not change the string if its first letter is already capitalized', () => {
    expect(capitalizeFirstLetter('Hello')).to.eq('Hello')
  })
})
