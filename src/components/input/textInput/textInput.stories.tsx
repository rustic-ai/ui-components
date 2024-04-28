import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import type { Message } from '../../types'
import TextInput from './textInput'

const meta: Meta<React.ComponentProps<typeof TextInput>> = {
  title: 'Rustic UI/Input/Text Input',
  component: TextInput,
  tags: ['autodocs'],
  argTypes: {
    ws: {
      description:
        'WebSocket connection to send and receive messages to and from a backend. \n<pre>```interface WebSocketClient {\n  send: (message: Message) => void\n  close: () => void\n  reconnect: () => void\n}```</pre>',
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `TextInput` component enables users to input text messages and send them over a WebSocket connection. It provides functionality for sending messages with a sender name, timestamp, and conversation ID.',
      },
    },
  },
  decorators: [
    (Story: StoryFn) => (
      <div style={{ width: 'clamp(250px, 25vw, 500px)' }}>
        <Story />
      </div>
    ),
  ],
}

meta.argTypes = {
  ...meta.argTypes,
  ws: {
    description:
      'WebSocket connection to send and receive messages to and from a backend.',
    table: {
      type: {
        summary: 'WebSocketClient.\n',
        detail:
          'send: (message: Message) => void\nclose: () => void\nreconnect: () => void\n',
      },
    },
  },
  sender: {
    description: 'The sender of the message.',
    table: {
      type: { summary: 'string' },
    },
  },
  conversationId: {
    description: 'Id of the current conversation.',
    table: {
      type: { summary: 'string' },
    },
  },
  label: {
    description:
      'Optional label text to be displayed in the input, which will then move to the top when the input is focused on. If both label and placeholder are provided, the placeholder will only be visible once the input is focused on.',
    table: {
      type: { summary: 'string' },
    },
  },
  placeholder: {
    description:
      'Optional placeholder text to be displayed in the input before user starts typing.',
    table: {
      type: { summary: 'string' },
    },
  },
  multiline: {
    description:
      'Optional boolean that dictates whether `TextInput` can expand to be multiline.',
    table: {
      type: { summary: 'boolean' },
    },
  },
  maxRows: {
    description: 'Optional maximum number of rows to be displayed.',
    table: {
      type: { summary: 'number' },
    },
  },
  fullWidth: {
    description:
      'Optional boolean that dictates whether `TextInput` takes up 100% width of the parent container.',
    table: {
      type: { summary: 'boolean' },
    },
  },
  enableSpeechToText: {
    description:
      'Optional boolean to enable speech-to-text. See which browsers are supported [here](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility).',
    table: {
      type: { summary: 'boolean' },
    },
  },
}
export default meta

export const Default = {
  args: {
    sender: 'You',
    conversationId: '1',
    placeholder: 'Type your message',
    ws: {
      send: (message: Message) => alert(`Message sent: ${message.data.text}`),
    },
  },
}

export const SpeechToText = {
  args: {
    ...Default.args,
    enableSpeechToText: true,
  },
}

export const NoMultiLine = {
  args: {
    ...Default.args,
    multiline: false,
  },
}

export const CustomizedMaxRows = {
  args: {
    ...Default.args,
    maxRows: 2,
  },
}

export const WithLabel = {
  args: {
    ...Default.args,
    label: 'Custom Label',
  },
}
