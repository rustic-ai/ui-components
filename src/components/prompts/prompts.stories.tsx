import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import type { Meta } from '@storybook/react/*'
import { useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import MessageSpace from '../messageSpace/messageSpace'
import Text from '../text/text'
import type { Message } from '../types'
import Prompts from './prompts'

const meta: Meta<React.ComponentProps<typeof Prompts>> = {
  title: 'Rustic UI/Prompts/Prompts',
  component: Prompts,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export default meta
meta.argTypes = {
  conversationId: {
    description:
      'Id of the current conversation. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`.',
    type: 'string',
  },
  position: {
    description:
      'The display position of the prompts container relative to the chat interface. When used within the `MessageSpace` component, the default is `hoverOverInput` if not explicitly set.',
    table: {
      type: {
        summary: 'inConversation | hoverOverInput',
        detail:
          'inConversation: Prompts are displayed at the top alongside other messages\n' +
          'hoverOverInput: Prompts are displayed above the input field, positioned at the bottom of the chat interface. It will only be displayed if it is the latest message.',
      },
    },
  },
  sender: {
    description:
      'Current user. This value will be set automatically if the component is rendered with `ElementRenderer` or `MessageSpace`.',
    table: {
      type: {
        summary: 'Sender',
        detail:
          'id: String representing sender id.\n' +
          'name: Optional string of sender name.',
      },
    },
  },
  ws: {
    description:
      'WebSocket connection to send and receive messages to and from a backend. The onReceive prop will override the default handler once it is set. If you need to use the WebSocket for purposes other than chat, you will need to create a separate WebSocket connection.',
    table: {
      type: {
        summary: 'WebSocketClient',
        detail:
          'A websocket client with supports the following methods:\n' +
          'send: (msg: Message) => void\n' +
          'close: () => void\n' +
          'reconnect: () => void\n' +
          'onReceive?: (handler: (message: Message) => void) => void',
      },
    },
  },
}
const user = { name: 'Some User', id: 'gahjqj19' }

export const Default = {
  decorators: [
    () => {
      const [messages, setMessages] = useState<Message[]>([
        {
          conversationId: '1',
          timestamp: new Date().toISOString(),
          id: getUUID(),
          sender: {
            name: '123',
            id: '123',
          },
          data: {
            prompts: [
              'What are the key steps to starting a new project?',
              'Generate a short poem about a rainy day.',
              'Having trouble with your device? Let me know the issue.',
              'How can I optimize my budget?',
            ],
            position: 'inConversation',
            className: 'rustic-prompts',
          },
          format: 'prompts',
        },
        {
          conversationId: '1',
          timestamp: new Date().toISOString(),
          id: getUUID(),
          sender: {
            name: '123',
            id: '123',
          },
          data: {
            prompts: [
              'What can you help me with?',
              'Summarize a document for me',
              'How do you handle security?',
            ],
            className: 'rustic-commands',
          },
          format: 'prompts',
        },
      ])

      return (
        <div
          style={{
            width: 'clamp(250px, 70vw, 1000px)',
            height: '700px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h6">Conversation 1</Typography>
          <Divider />
          <MessageSpace
            ws={{
              send: (selection: Message) => {
                setMessages((prev) => [...prev, selection])
              },
              close: () => {},
              reconnect: () => {},
            }}
            sender={user}
            receivedMessages={messages}
            getProfileComponent={(msg) => (
              <Typography variant="caption">{msg.sender.name}</Typography>
            )}
            supportedElements={{ text: Text, prompts: Prompts }}
          />
        </div>
      )
    },
  ],
}
