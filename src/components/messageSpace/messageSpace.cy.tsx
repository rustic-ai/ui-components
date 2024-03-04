import { v4 as getUUID } from 'uuid'

import {
  FCCalendar,
  Image,
  MarkedMarkdown,
  MarkedStreamingMarkdown,
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
  it('renders correctly with provided messages', () => {
    cy.mount(
      <MessageSpace messages={messages} supportedElements={supportedElements} />
    )
    const messageSpace = '[data-cy=message-space]'

    cy.get(messageSpace).should('exist')

    messages.forEach((message) => {
      cy.get(messageSpace)
        .should('contain', message.sender)
        .and('contain', message.data.text)
    })
  })
})
