import 'cypress-real-events'

import Copy from './copy'
describe('Copy component', () => {
  const copyButton = '[data-cy=copy-button]'

  const message = {
    id: '1',
    timestamp: '2020-01-02T00:00:00.000Z',
    sender: 'senderId',
    conversationId: 'lkd9vc',
    topicId: 'default',
    format: 'text',
    data: { text: 'Hello World' },
  }

  it('should copy text when clicked', () => {
    cy.mount(<Copy message={message} />)

    cy.get(copyButton).focus().realClick()

    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq('Hello World')
      })
    })
  })
})
