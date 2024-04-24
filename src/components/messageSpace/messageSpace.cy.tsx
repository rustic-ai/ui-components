import { v4 as getUUID } from 'uuid'

import { supportedViewports } from '../../../cypress/support/variables'
import {
  FCCalendar,
  Image,
  MarkedMarkdown,
  MarkedStreamingMarkdown,
  type Message,
  OpenLayersMap,
  RechartsTimeSeries,
  StreamingText,
  Table,
  Text,
  YoutubeVideo,
} from '..'
import Icon from '../icon'
import MessageSpace from './messageSpace'

describe('MessageSpace Component', () => {
  const supportedElements = {
    text: Text,
    streamingText: StreamingText,
    markdown: MarkedMarkdown,
    streamingMarkdown: MarkedStreamingMarkdown,
    image: Image,
    timeSeries: RechartsTimeSeries,
    map: OpenLayersMap,
    youtubeVideo: YoutubeVideo,
    table: Table,
    calendar: FCCalendar,
  }

  const conversationId = '1'

  const agentMessageData = {
    id: getUUID(),
    sender: 'Agent',
    conversationId,
  }

  const humanMessageData = {
    id: getUUID(),
    sender: 'You',
    conversationId,
  }

  const messages = [
    {
      ...humanMessageData,
      timestamp: '2024-01-02T00:00:00.000Z',
      format: 'streamingMarkdown',
      data: {
        text: 'message 1',
      },
    },
    {
      ...agentMessageData,
      timestamp: '2024-01-02T00:01:00.000Z',
      format: 'text',
      data: {
        text: 'message 2',
      },
    },
    {
      ...humanMessageData,
      timestamp: '2024-01-02T00:12:00.000Z',
      format: 'text',
      data: {
        text: 'message 3',
      },
    },
  ]

  supportedViewports.forEach((viewport) => {
    it(`renders correctly with provided messages on ${viewport} screen`, () => {
      cy.viewport
      cy.mount(
        <MessageSpace
          messages={messages}
          supportedElements={supportedElements}
          getProfileComponent={(message: Message) => {
            if (message.sender.includes('Agent')) {
              return <Icon name="smart_toy" />
            } else {
              return <Icon name="account_circle" />
            }
          }}
        />
      )
      const messageSpace = '[data-cy=message-space]'
      const messageCanvas = '[data-cy=message-canvas]'
      cy.get(messageSpace).should('exist')

      messages.forEach((message, index) => {
        cy.get(messageSpace)
          .should('contain', message.sender)
          .and('contain', message.data.text)
        if (message.sender === 'Agent') {
          cy.get(messageCanvas)
            .eq(index)
            .within(() => {
              cy.get('span[data-cy="smart-toy-icon"]').should('exist')
            })
        } else {
          cy.get(messageCanvas)
            .eq(index)
            .within(() => {
              cy.get('span[data-cy="account-circle-icon"]').should('exist')
            })
        }
      })
    })
  })
})
