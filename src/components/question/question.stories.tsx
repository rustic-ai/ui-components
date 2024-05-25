import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import type { Message } from '../types'
import Question from './question'

const meta: Meta<React.ComponentProps<typeof Question>> = {
  title: 'Rustic UI/Question/Question',
  component: Question,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div style={{ maxWidth: '400px' }}>
          <Story />
        </div>
      )
    },
  ],
}

meta.argTypes = {
  ws: {
    description:
      'WebSocket connection to send and receive messages to and from a backend. Used for sending answer replies to this question.',
    table: {
      type: {
        summary: 'WebSocketClient',
        detail:
          'send: (message: Message) => void\nclose: () => void\nreconnect: () => void\n',
      },
    },
  },
  options: {
    description: 'Array of options to choose from.',
    table: {
      type: {
        summary: 'Option',
        detail:
          'label: A string label.\nvalue: Some value associated with this answer of any type.',
      },
    },
  },
}

export default meta

const options = ['Accept', 'Ignore']

const manyOptions = ['Of course', 'Yes', 'Maybe', 'No', 'Absolutely not']

const conversationData = {
  currentUser: 'You',
  conversationId: '1',
  messageId: '1',
  ws: {
    send: (message: Message) => alert(`Message sent: ${message.data.text}`),
  },
}

export const Default = {
  args: {
    ...conversationData,
    title: 'What do you think?',
    description:
      'The description supports **markdown**! Choose either of the options *below*.',
    options: options,
  },
}

export const MultipleChoice = {
  args: {
    ...conversationData,
    title: 'Do pineapples belong on pizza?',
    description: 'You can only choose one. Choose wisely.',
    options: manyOptions,
  },
}
