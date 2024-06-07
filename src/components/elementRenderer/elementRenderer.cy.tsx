import React from 'react'

import {
  supportedViewports,
  testUser,
} from '../../../cypress/support/variables'
import { YoutubeVideo } from '..'
import Text from '../text/text'
import ElementRenderer from './elementRenderer'

const supportedElements = {
  text: Text,
  video: YoutubeVideo,
}

const sampleMessage = {
  id: '1',
  timestamp: '2020-01-02T00:00:00.000Z',
  sender: testUser,
  conversationId: 'lkd9vc',
  topicId: 'default',
}

const commonProps = {
  sender: testUser,
  supportedElements: supportedElements,
}

describe('ElementRenderer', () => {
  supportedViewports.forEach((viewport) => {
    it(`renders the correct element for a supported format on ${viewport} screen`, () => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.viewport(viewport)
      cy.mount(
        <ElementRenderer
          message={{
            ...sampleMessage,
            data: { text: 'Test Text' },
            format: 'text',
          }}
          {...commonProps}
          ws={mockWsClient}
        />
      )
      cy.get('p').should('contain.text', 'Test Text')
      cy.mount(
        <ElementRenderer
          message={{
            ...sampleMessage,
            data: { youtubeVideoId: 'MtN1YnoL46Q' },
            format: 'video',
          }}
          {...commonProps}
          ws={mockWsClient}
        />
      )

      const youtubeVideoIframe = '[data-cy="youtube-video-iframe"]'
      cy.get(youtubeVideoIframe).then(($iframe) => {
        const src = $iframe.attr('src')
        const successStatusCode = 200
        expect(src).to.exist
        if (src) {
          cy.request(src).its('status').should('equal', successStatusCode)
        }
      })
    })

    it(`renders a message for an unsupported format on ${viewport} screen`, () => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.viewport(viewport)
      cy.mount(
        <ElementRenderer
          message={{
            ...sampleMessage,
            data: { text: 'Test Text' },
            format: 'unsupported',
          }}
          {...commonProps}
          ws={mockWsClient}
        />
      )

      cy.contains('Unsupported element format: unsupported').should('exist')
    })
  })
})
