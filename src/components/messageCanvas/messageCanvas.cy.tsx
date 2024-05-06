/* eslint-disable no-magic-numbers */
import 'cypress-real-events'

import { supportedViewports } from '../../../cypress/support/variables'
import Icon from '../icon'
import type { ThreadableMessage } from '../types'
import CopyText from './actions/copy/copyText'
import MessageCanvas from './messageCanvas'

describe('MessageCanvas', () => {
  const testMessage = {
    id: '1',
    timestamp: '2020-01-02T00:00:00.000Z',
    sender: 'senderId',
    conversationId: 'lkd9vc',
    topicId: 'default',
    format: 'text',
    data: { text: 'Hello World' },
  }

  const testMessageUpdate = {
    ...testMessage,
    lastThreadMessage: {
      id: '3',
      timestamp: '2020-01-02T00:00:00.000Z',
      sender: 'senderId',
      conversationId: 'lkd9vc',
      topicId: 'default',
      threadId: '2',
      format: 'text',
      data: { text: '!' },
    },
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
      cy.contains('senderId').should('be.visible')
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

  context('Desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-13')
    })

    it('shows timestamp on hover', () => {
      cy.mount(
        <MessageCanvas message={testMessage}>
          <p>Hello World</p>
        </MessageCanvas>
      )
      cy.contains('Jan 1, 2020').should('not.be.visible')
      cy.get(messageCanvas).realHover()
      cy.contains('Jan 1, 2020').should('be.visible')
    })

    it('shows that it was last updated if an update is provided', () => {
      cy.mount(
        <MessageCanvas message={testMessageUpdate}>
          <p>Hello World</p>
        </MessageCanvas>
      )

      cy.get(messageCanvas).realHover()
      cy.contains('last updated').should('be.visible')
    })
  })

  context('Mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
    })

    it('shows timestamp on touch', () => {
      cy.mount(
        <MessageCanvas message={testMessage}>
          <p>Hello World</p>
        </MessageCanvas>
      )
      cy.contains('Jan 1, 2020').should('not.be.visible')
      cy.get(messageCanvas).realTouch()
      cy.contains('Jan 1, 2020').should('be.visible')
    })

    it('shows that it was last updated if an update is provided', () => {
      cy.mount(
        <MessageCanvas message={testMessageUpdate}>
          <p>Hello World</p>
        </MessageCanvas>
      )

      cy.get(messageCanvas).realTouch()
      cy.contains('last updated').should('be.visible')
    })
  })
})
