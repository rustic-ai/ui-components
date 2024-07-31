/* eslint-disable no-magic-numbers */

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Stack } from '@mui/system'
import type { Meta, StoryFn } from '@storybook/react/*'
import { Server } from 'mock-socket'
import React, { useState } from 'react'
import { v4 as getUUID } from 'uuid'

import TextInput from '../input/textInput/textInput'
import MessageSpace from '../messageSpace/messageSpace'
import { getMockWebSocketClient, sendMessageToClient } from '../mockWebSocket'
import Question from '../question/question'
import Text from '../text/text'
import type { Message, QuestionProps } from '../types'
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
    description:
      'WebSocket connection to send and receive messages to and from a backend. The key methods to focus on are `send` and `onReceive`.\n\n' +
      "The `onReceive` method is responsible for providing access to the WebSocket's `onmessage` event through `handler`, allowing `PromptBuilder` to receive and render messages from the server. An `onReceive` method is needed for the functionality of this component.\n\n" +
      'The `send` method is responsible for sending user inputs to the server. It sends the captured inputs as messages whenever the "Next Question" is clicked. It will also send captured inputs when clicking "Generate", even if "Next Question" was not clicked beforehand.',
    type: { name: 'object', required: true, value: {} },
    table: {
      type: {
        summary: 'WebSocketClient\n',
        detail:
          'A websocket client that supports the following methods:\n' +
          'send: (msg: Message) => void\n' +
          'close: () => void\n' +
          'reconnect: () => void\n' +
          'onReceive?:  (handler: (message: Message) => void) => void',
      },
    },
  },
  sender: {
    description: 'The current user.',
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
  getProfileComponent: {
    description:
      'A function that returns a React element to display sender details, like names and/or avatars. Here, it can be used to display the prompt builder agent\'s name or you can provide your own custom header. If this prop is not used, a default display of the name "Prompt Builder" will be shown.',
    type: 'function',
    table: {
      type: {
        summary: '(message: Message) => ReactNode',
      },
    },
  },
}

export default meta

const webSocketUrl = 'ws://localhost:8080'
const server = new Server(webSocketUrl)

server.on('connection', (socket) => {
  sendMessageToClient(socket, 'textInput', {
    title:
      'Hi there! Let’s build a prompt together. What is your question or topic?',
  })

  const receivedClientResponses = []

  socket.on('message', (message) => {
    const parsedMessage = JSON.parse(message as string)
    receivedClientResponses.push(parsedMessage)

    if (receivedClientResponses.length === 1) {
      sendMessageToClient(socket, 'question', {
        title: 'What is your main goal?',
        options: [
          'grow my business',
          'sell internationally',
          'hire or train employees',
        ],
      })
    } else if (receivedClientResponses.length === 2) {
      sendMessageToClient(socket, 'question', {
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
      })
    } else if (receivedClientResponses.length === 3) {
      sendMessageToClient(socket, 'text', {
        text: 'Great! Generate a prompt now or help me learn more for a better result.',
      })
      sendMessageToClient(socket, 'question', {
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
      })
      sendMessageToClient(socket, 'promptBuilder', {
        isLastQuestion: true,
      })
    } else if (receivedClientResponses.length === 4) {
      sendMessageToClient(socket, 'question', {
        title:
          "I'm not a real agent, but if I were, I would continue to ask you relevant questions to continue building an effective prompt.",
        options: ['Understood', 'Sounds good'],
      })
    }
  })
})

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
        variant="rusticSecondary"
        size="small"
      >
        Submit
      </Button>
    </Stack>
  )
}

const messageSpaceAgent = { name: 'Agent', id: '2' }
const user = { name: 'You', id: '1' }
const conversationId = '1'
const messageId = getUUID()

const args = {
  sender: user,
  messageId: messageId,
  supportedElements: {
    text: Text,
    question: Question,
    textInput: CustomTextInput,
  },
}

export const Default = {
  decorators: [
    (Story: StoryFn) => {
      const [isPromptBuilderOpen, setIsPromptBuilderOpen] = useState(false)
      const [messageSpaceMessages, setMessageSpaceMessages] = useState<
        Message[]
      >([
        {
          conversationId,
          id: getUUID(),
          timestamp: new Date().toISOString(),
          sender: messageSpaceAgent,
          format: 'text',
          data: { text: 'Hello! How can I help you?' },
        },
      ])

      const boilerplateWs = {
        send: (message: Message) => {
          setMessageSpaceMessages((prev) => [...prev, message])
        },
        close: () => {},
        reconnect: () => {},
        onReceive: () => {},
      }

      function handleOnSubmit() {
        setIsPromptBuilderOpen(false)
        setTimeout(() => {
          setMessageSpaceMessages((prev) => [
            ...prev,
            {
              conversationId,
              id: getUUID(),
              timestamp: new Date().toISOString(),
              sender: messageSpaceAgent,
              format: 'text',
              data: {
                text: 'Here is a refined prompt I have generated based on your input to get you optimum results.\n\n"I\'m looking to grow my business, which currently has more than 50 employees and is based in North America. I need strategies and actionable insights to achieve significant growth. Specifically, I\'m interested in:\n\n1. Effective marketing techniques tailored to North American markets.\n\n2. Best practices for scaling operations while maintaining quality and customer satisfaction.\n\n3. Innovative ways to optimize our workforce for higher productivity and employee engagement.\n\n4. Leveraging technology and digital tools to streamline processes and improve efficiency.\n\n5. Identifying new market opportunities and expanding our customer base.\n\nPlease provide detailed suggestions, case studies, or examples relevant to businesses in similar situations. Include steps for implementation and potential challenges to consider."',
              },
              inReplyTo: messageId,
            },
          ])
        }, 500)
      }

      function renderPromptBuilder() {
        if (isPromptBuilderOpen) {
          return (
            <Story
              args={{
                ...args,
                ws: getMockWebSocketClient(webSocketUrl),
                onCancel: () => setIsPromptBuilderOpen(false),
                onSubmit: handleOnSubmit,
              }}
            />
          )
        } else {
          return (
            <Chip
              variant="rusticSecondary"
              label="Build a prompt"
              onClick={() => setIsPromptBuilderOpen(true)}
            />
          )
        }
      }

      return (
        <Stack justifyContent="center">
          <Typography variant="h4">Message Space</Typography>
          <Divider sx={{ marginTop: 2 }} />
          <Stack
            sx={{
              justifyContent: 'space-between',
              height: 500,
              paddingTop: 2,
              gap: 2,
            }}
          >
            <MessageSpace
              ws={boilerplateWs}
              sender={user}
              supportedElements={{ text: Text }}
              messages={messageSpaceMessages}
              getProfileComponent={(message) => {
                return <>{message.sender.name}</>
              }}
            />
            <Box overflow="scroll">{renderPromptBuilder()}</Box>
            {!isPromptBuilderOpen && (
              <TextInput
                ws={boilerplateWs}
                sender={user}
                conversationId={conversationId}
                placeholder="Type your message..."
              />
            )}
          </Stack>
        </Stack>
      )
    },
  ],
}
