import 'cypress-real-events'

import { v4 as getUUID } from 'uuid'

import {
  botUser,
  supportedViewports,
  testUser,
} from '../../../cypress/support/variables'
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
import Icon from '../icon/icon'
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
    sender: botUser,
    conversationId,
  }

  const humanMessageData = {
    sender: testUser,
    conversationId,
  }

  const messages = [
    {
      ...humanMessageData,
      id: getUUID(),
      timestamp: '2024-01-02T00:00:00.000Z',
      format: 'streamingMarkdown',
      data: {
        text: 'message 1',
      },
    },
    {
      ...agentMessageData,
      id: getUUID(),
      timestamp: '2024-01-02T00:01:00.000Z',
      format: 'text',
      data: {
        text: 'message 2',
      },
    },
    {
      ...humanMessageData,
      id: getUUID(),
      timestamp: '2024-01-02T00:12:00.000Z',
      format: 'text',
      data: {
        text: 'message 3',
      },
    },
  ]

  const messageSpace = '[data-cy=message-space]'

  supportedViewports.forEach((viewport) => {
    it(`renders correctly with provided messages on ${viewport} screen`, () => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.viewport(viewport)
      cy.mount(
        <MessageSpace
          ws={mockWsClient}
          sender={testUser}
          messages={messages}
          supportedElements={supportedElements}
          getProfileComponent={(message: Message) => {
            if (message.sender.name?.includes('Agent')) {
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
        cy.get(messageSpace).should('contain', message.data.text)
        if (message.sender.name?.includes('Agent')) {
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

    it(`scrolls to bottom when "Go to bottom" button is clicked on ${viewport} screen`, () => {
      const waitTime = 500

      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.viewport(viewport)
      cy.mount(
        <div style={{ height: '200px' }}>
          <MessageSpace
            ws={mockWsClient}
            sender={testUser}
            messages={messages}
            supportedElements={supportedElements}
          />
        </div>
      )

      cy.get('p').contains('message 3').should('be.visible')
      cy.get(messageSpace).contains('message 1').should('not.be.visible')
      cy.get(messageSpace).scrollTo('top', { duration: 500 })
      cy.wait(waitTime)
      cy.get('[data-cy=scroll-down-button]').should('be.visible').realClick()

      cy.get(messageSpace).then((messageList) => {
        cy.wrap(messageList).within(() => {
          cy.contains('message 3').should('be.visible')
        })
      })
    })
  })
})
