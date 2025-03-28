import 'cypress-real-events'

import { Server } from 'mock-socket'
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
  Prompts,
  RechartsTimeSeries,
  StreamingText,
  Table,
  Text,
  UniformsForm,
  YoutubeVideo,
} from '..'
import Icon from '../icon/icon'
import { getMockWebSocketClient } from '../mockWebSocket'
import MessageSpace from './messageSpace'

describe('MessageSpace Component', () => {
  const messageCanvas = '[data-cy=message-canvas]'

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
    form: UniformsForm,
    prompts: Prompts,
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
  const messageContainer = '[data-cy=message-container]'

  const webSocketUrl = 'ws://localhost:8082'
  const streamingTextRootMessageId = getUUID()
  const messagesToBeSent = [
    {
      ...humanMessageData,
      id: getUUID(),
      timestamp: new Date().toISOString(),
      format: 'text',
      data: {
        text: 'Could you show me an example of the streaming text component?',
      },
    },
    {
      ...agentMessageData,
      id: streamingTextRootMessageId,
      timestamp: new Date().toISOString(),
      format: 'streamingText',
      data: {
        text: 'Sure!',
      },
    },
    {
      ...agentMessageData,
      id: getUUID(),
      threadId: streamingTextRootMessageId,
      timestamp: new Date().toISOString(),
      format: 'updateStreamingText',
      data: {
        text: ' The text',
      },
    },
    {
      ...agentMessageData,
      id: streamingTextRootMessageId,
      threadId: streamingTextRootMessageId,
      timestamp: new Date().toISOString(),
      format: 'updateStreamingText',
      data: {
        text: ' is displayed',
      },
    },
    {
      ...agentMessageData,
      id: streamingTextRootMessageId,
      threadId: streamingTextRootMessageId,
      timestamp: new Date().toISOString(),
      format: 'updateStreamingText',
      data: {
        text: ' progressively.',
      },
    },
  ]

  let server: Server | null

  const setupWebSocketServer = () => {
    server = new Server(webSocketUrl)
    const serverDelay = 50
    server.on('connection', (socket) => {
      messagesToBeSent.forEach((message, index) => {
        setTimeout(
          () => socket.send(JSON.stringify(message)),
          serverDelay + index * serverDelay
        )
      })
    })
  }

  const teardownWebSocketServer = () => {
    if (server) {
      server.stop()
      server = null
    }
  }
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
          receivedMessages={messages}
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

    it(`can receive and render messages from websocket on ${viewport} screen`, () => {
      setupWebSocketServer()
      cy.viewport(viewport)
      cy.mount(
        <MessageSpace
          ws={getMockWebSocketClient(webSocketUrl)}
          sender={testUser}
          receivedMessages={[
            {
              ...humanMessageData,
              id: getUUID(),
              timestamp: '2024-01-02T00:00:00.000Z',
              format: 'text',
              data: {
                text: 'Existing message',
              },
            },
          ]}
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
      cy.get(messageSpace).should('exist')
      cy.get(messageSpace).should('contain', 'Existing message')
      cy.get(messageSpace).should(
        'not.contain',
        'Sure! The text is displayed progressively.'
      )
      cy.get(messageCanvas).should('have.length', 1)
      messagesToBeSent.forEach((message) => {
        cy.get(messageSpace).should('contain', message.data.text)
      })
      cy.get(messageSpace).should(
        'contain',
        'Sure! The text is displayed progressively.'
      )
      const totalDisplayedMessages = 3
      cy.get(messageCanvas).should('have.length', totalDisplayedMessages)
      teardownWebSocketServer()
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
        <div style={{ height: '200px', display: 'flex' }}>
          <MessageSpace
            ws={mockWsClient}
            sender={testUser}
            receivedMessages={messages}
            supportedElements={supportedElements}
          />
        </div>
      )

      cy.get('p').contains('message 3').should('be.visible')
      cy.get(messageSpace).contains('message 1').should('not.be.visible')
      cy.get(messageContainer).scrollTo('top', { duration: 500 })
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(waitTime)
      cy.get('[data-cy=scroll-down-button]').should('be.visible').realClick()

      cy.get(messageSpace).then((messageList) => {
        cy.wrap(messageList).within(() => {
          cy.contains('message 3').should('be.visible')
        })
      })
    })

    it(`renders form response correctly on ${viewport} screen`, () => {
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
          receivedMessages={[
            {
              ...agentMessageData,
              id: 'formId',
              timestamp: '2024-01-02T00:01:00.000Z',
              format: 'form',
              data: {
                title: 'Choose the days',
                schema: {
                  title: 'Address',
                  type: 'object',
                  properties: {
                    city: { type: 'string' },
                    state: { type: 'string' },
                    street: { type: 'string' },
                    zip: { type: 'string', pattern: '[0-9]{5}' },
                  },
                  required: ['street', 'zip', 'state'],
                },
              },
            },
            {
              ...humanMessageData,
              id: getUUID(),
              timestamp: '2024-01-02T00:12:00.000Z',
              inReplyTo: 'formId',
              format: 'formResponse',
              data: {
                inReplyTo: 'formId',
                data: {
                  city: 'Vancouver',
                  state: 'BC',
                  street: '1575 W Georgia St',
                  zip: 'V6G 2V3',
                },
              },
            },
          ]}
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
      cy.get(messageSpace).should('exist')
      cy.get(messageSpace)
        .find('input')
        .first()
        .should('have.value', 'Vancouver')
      cy.get(messageSpace).find('input').last().should('have.value', 'V6G 2V3')
    })

    it(`renders prompts properly in the correct position on ${viewport} screen`, () => {
      cy.viewport(viewport)
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }
      cy.mount(
        <div style={{ height: '200px', display: 'flex' }}>
          <MessageSpace
            ws={mockWsClient}
            sender={testUser}
            receivedMessages={[
              ...messages,
              {
                id: getUUID(),
                format: 'prompts',
                conversationId: conversationId,
                timestamp: new Date().toISOString(),
                data: {
                  prompts: ['top prompt'],
                  position: 'inConversation',
                },
                sender: botUser,
              },
              {
                id: getUUID(),
                format: 'prompts',
                conversationId: conversationId,
                timestamp: new Date().toISOString(),
                data: {
                  prompts: ['bottom prompt'],
                },
                sender: botUser,
              },
            ]}
            supportedElements={supportedElements}
          />
        </div>
      )
      cy.get(messageContainer).should('contain', 'top prompt')
      cy.get(messageSpace).contains('bottom prompt')
      cy.get(messageContainer).should('not.contain', 'bottom prompt')
    })

    it(`only renders bottom prompts when it's the last message in the receivedMessages on ${viewport} screen`, () => {
      cy.viewport(viewport)
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }
      cy.mount(
        <div style={{ height: '200px', display: 'flex' }}>
          <MessageSpace
            ws={mockWsClient}
            sender={testUser}
            receivedMessages={[
              ...messages,
              {
                id: getUUID(),
                format: 'prompts',
                conversationId: conversationId,
                timestamp: new Date().toISOString(),
                data: {
                  prompts: ['bottom prompt'],
                },
                sender: botUser,
              },
              {
                id: getUUID(),
                format: 'prompts',
                conversationId: conversationId,
                timestamp: new Date().toISOString(),
                data: {
                  prompts: ['top prompt'],
                  position: 'inConversation',
                },
                sender: botUser,
              },
            ]}
            supportedElements={supportedElements}
          />
        </div>
      )
      cy.get(messageContainer).should('contain', 'top prompt')
      cy.get(messageSpace).should('not.contain', 'bottom prompt')
    })
  })
})
