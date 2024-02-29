import React from 'react'

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
  sender: 'Some Sender',
  conversationId: 'lkd9vc',
  topicId: 'default',
}

describe('ElementRenderer', () => {
  it('renders the correct element for a supported format', () => {
    cy.mount(
      <ElementRenderer
        message={{
          ...sampleMessage,
          data: { text: 'Test Text' },
          format: 'text',
        }}
        supportedElements={supportedElements}
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
        supportedElements={supportedElements}
      />
    )

    const youtubeVideoIframe = '[data-cy="youtube-video-iframe"]'
    const loadingSpinner = '[data-cy="spinner"]'
    cy.get(loadingSpinner).should('not.exist')
    cy.get(youtubeVideoIframe).then(($iframe) => {
      const src = $iframe.attr('src')
      const successStatusCode = 200
      expect(src).to.exist
      if (src) {
        cy.request(src).its('status').should('equal', successStatusCode)
      }
    })
  })

  it('renders a message for an unsupported format', () => {
    cy.mount(
      <ElementRenderer
        message={{
          ...sampleMessage,
          data: { text: 'Test Text' },
          format: 'unsupported',
        }}
        supportedElements={supportedElements}
      />
    )

    cy.contains('Unsupported element format: unsupported').should('exist')
  })
})
