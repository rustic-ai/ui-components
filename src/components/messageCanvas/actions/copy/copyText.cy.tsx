import 'cypress-real-events'

import {
  supportedViewports,
  testUser,
} from '../../../../../cypress/support/variables'
import CopyText from './copyText'
describe('Copy component', () => {
  const copyButton = '[data-cy=copy-text-button]'

  const message = {
    id: '1',
    timestamp: '2020-01-02T00:00:00.000Z',
    sender: testUser,
    conversationId: 'lkd9vc',
    topicId: 'default',
    format: 'text',
    data: { text: 'Hello World' },
  }

  supportedViewports.forEach((viewport) => {
    it(`should copy text when clicked on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<CopyText message={message} />)

      if (viewport === 'iphone-6') {
        cy.get(copyButton).focus().realTouch()
      } else {
        cy.get(copyButton).focus().realClick()
      }

      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          expect(text).to.eq('Hello World')
        })
      })
    })
  })
})
