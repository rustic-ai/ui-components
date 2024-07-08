import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Stack } from '@mui/system'
import type { Meta, StoryFn } from '@storybook/react/*'
import React, { useState } from 'react'
import { v4 as getUUID } from 'uuid'

import Question from '../question/question'
import Text from '../text/text'
import type {
  Message,
  MessageData,
  QuestionProps,
  ThreadableMessage,
} from '../types'
import PromptBuilder from './promptBuilder'

const meta: Meta<React.ComponentProps<typeof PromptBuilder>> = {
  title: 'Rustic UI/Prompt Builder/Prompt Builder',
  component: PromptBuilder,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div style={{ width: 'clamp(300px,50vw,600px)' }}>
          <Story />
        </div>
      )
    },
  ],
}

meta.argTypes = {
  ws: {
    type: { name: 'string', required: true },
    description:
      'WebSocket connection to send and receive messages to and from a backend.',
    table: {
      type: {
        summary: 'WebSocketClient\n',
        detail:
          'A websocket client with supports the following methods:\n' +
          'send: (msg: Message) => void\n' +
          'close: () => void\n' +
          'reconnect: () => void',
      },
    },
  },
  sender: {
    description: 'The sender of the message.',
    type: { name: 'object', required: true, value: {} },
    table: {
      type: {
        summary: 'Sender',
        detail:
          'id: String representing sender id.\n' +
          'name: Optional string of sender name.',
      },
    },
  },
  supportedElements: {
    description:
      'A component map contains message formats as keys and their corresponding React components as values.',
    type: { name: 'object', required: true, value: {} },
    table: {
      type: {
        summary: 'ComponentMap',
      },
    },
  },
  messages: {
    description:
      'An array of messages to be rendered. See `MessageSpace` for more details about the `ThreadableMessage` object.',
    type: { name: 'object', required: false, value: {} },
    table: {
      type: {
        summary: 'ThreadableMessage[]',
      },
    },
  },
}

export default meta

const promptBuilderAgent = { name: 'Prompt Builder', id: '2' }
const user = { name: 'You', id: '1' }

function CustomTextInput(props: Omit<QuestionProps, 'options'>) {
  const [messageText, setMessageText] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  function handleSendMessage(): void {
    const currentTime = new Date().toISOString()
    const formattedMessage: Message = {
      id: getUUID(),
      timestamp: currentTime,
      sender: props.sender,
      conversationId: props.conversationId,
      format: 'text',
      data: { text: messageText },
      inReplyTo: props.messageId,
    }

    props.ws.send(formattedMessage)
    setIsSubmitted(true)
  }

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{props.title}</Typography>
      <TextField
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        disabled={isSubmitted}
        multiline
        rows={2}
      />
      <Button
        onClick={handleSendMessage}
        disabled={isSubmitted || !messageText.trim()}
        variant="outlined"
        size="small"
      >
        Submit
      </Button>
    </Stack>
  )
}

const args = {
  sender: user,
  conversationId: '1',
  messageId: getUUID(),
  onClose: () => {},
  supportedElements: {
    text: Text,
    question: Question,
    textInput: CustomTextInput,
  },
}

function generateMessage(format: string, data: MessageData) {
  return {
    id: getUUID(),
    sender: promptBuilderAgent,
    timestamp: new Date().toISOString(),
    conversationId: '1',
    format,
    data,
  }
}

export const Default = {
  decorators: [
    (Story: StoryFn) => {
      const [messages, setMessages] = useState<ThreadableMessage[]>([
        generateMessage('textInput', {
          title:
            'Hi there! Let’s build a prompt together. What is your question or topic?',
        }),
      ])

      const messageFlows = [
        {
          title: 'What is your main goal?',
          options: [
            'grow my business',
            'sell internationally',
            'hire or train employees',
          ],
        },
        {
          title: 'How many employees do you have?',
          options: [
            'Just me',
            '1 to 5 people',
            '10 to 20 people',
            '30 to 50',
            'More than 50',
            'More than 100',
            'More than 300',
          ],
        },
      ]

      const handleMessages = () => {
        const delay = 2000
        const nextFlow = messageFlows[messages.length - 1]
        const generatingThreshold = 3

        if (nextFlow) {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              generateMessage('question', nextFlow),
            ])
          }, delay)
        } else if (messages.length === generatingThreshold) {
          // agent decides there is sufficient enough information to generate a prompt
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              generateMessage('text', {
                text: 'Generate a prompt now or help me learn more for a better result.',
              }),
              generateMessage('question', {
                title: 'Where is your company based?',
                options: [
                  'North America',
                  'Europe',
                  'Asia',
                  'Africa',
                  'Australia',
                  'South America',
                  'Antarctica',
                ],
              }),
              {
                id: getUUID(),
                sender: promptBuilderAgent,
                timestamp: new Date().toISOString(),
                conversationId: '1',
                format: 'promptBuilder',
                data: { isLastQuestion: true },
              },
            ])
          }, delay)
        } else {
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              generateMessage('question', {
                title:
                  "I'm not a real agent, but if I were, I would continue to ask you relevant questions to continue building an effective prompt.",
                options: ['Understood', 'Sounds good'],
              }),
            ])
          }, delay)
        }
      }

      return (
        <Story
          args={{
            ...args,
            messages,
            ws: {
              send: handleMessages,
            },
          }}
        />
      )
    },
  ],
}
