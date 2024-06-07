/* eslint-disable no-magic-numbers */
import 'cypress-real-events'

import {
  supportedViewports,
  testUser,
} from '../../../cypress/support/variables'
import Icon from '../icon/icon'
import type { ThreadableMessage } from '../types'
import CopyText from './actions/copy/copyText'
import MessageCanvas from './messageCanvas'

describe('MessageCanvas', () => {
  const testMessage = {
    id: '1',
    timestamp: '2020-01-02T00:00:00.000Z',
    sender: testUser,
    conversationId: 'lkd9vc',
    topicId: 'default',
    format: 'text',
    data: { text: 'Hello World' },
  }

  const messageCanvas = '[data-cy=message-canvas]'
  supportedViewports.forEach((viewport) => {
    it(`renders the component on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <MessageCanvas
          message={testMessage}
          getProfileComponent={() => <Icon name="account_circle" />}
        >
          <p>Hello World</p>
        </MessageCanvas>
      )

      cy.contains('Hello World').should('be.visible')
      cy.contains(testUser.name).should('be.visible')
      cy.contains('Jan 1, 2020').should('be.visible')
      cy.get('[data-cy="account-circle-icon"]').should('be.visible')
    })

    it(`allows copying text on ${viewport} screen`, () => {
      cy.mount(
        <MessageCanvas
          message={testMessage}
          getActionsComponent={(message: ThreadableMessage) => {
            const copyButton = message.format === 'text' && (
              <CopyText message={message} />
            )
            if (copyButton) {
              return <>{copyButton}</>
            }
          }}
        >
          <p>Hello World</p>
        </MessageCanvas>
      )
      if (viewport === 'iphone-6') {
        cy.get(messageCanvas).realTouch()
      } else {
        cy.get(messageCanvas).realHover()
      }

      cy.get('[data-cy=copy-text-button]').focus().realClick()
      cy.window().then((win) => {
        win.navigator.clipboard.readText().then((text) => {
          expect(text).to.eq('Hello World')
        })
      })
    })
  })
})
