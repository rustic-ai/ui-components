import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { v4 as getUUID } from 'uuid'

import { supportedViewports } from '../../../cypress/support/variables'
import {
  FCCalendar,
  Image,
  MarkedMarkdown,
  MarkedStreamingMarkdown,
  type MessageProps,
  OpenLayersMap,
  RechartsTimeSeries,
  StreamingText,
  Table,
  Text,
  YoutubeVideo,
} from '..'
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
          getProfileComponent={(message: MessageProps) => {
            if (message.sender.includes('Agent')) {
              return <SmartToyIcon data-cy="agent-icon" />
            } else {
              return <AccountCircleIcon data-cy="human-icon" />
            }
          }}
        />
      )
      const messageSpace = '[data-cy=message-space]'

      cy.get(messageSpace).should('exist')

      messages.forEach((message, index) => {
        cy.get(messageSpace)
          .should('contain', message.sender)
          .and('contain', message.data.text)
        if (message.sender === 'Agent') {
          cy.get('svg').eq(index).should('have.attr', 'data-cy', 'agent-icon')
        } else {
          cy.get('svg').eq(index).should('have.attr', 'data-cy', 'human-icon')
        }
      })
    })
  })
})
