import type { Meta, StoryFn } from '@storybook/react'
import React, { useState } from 'react'

import MessageCanvas from '../messageCanvas/messageCanvas'
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
      'WebSocket connection to send and receive messages to and from a backend. Used for sending answer replies to this question. If this component is rendered with `ElementRenderer` or `MessageSpace`, this value will be set automatically.',
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
  currentUser: {
    description:
      'ID of the current user. This will be used to set the user that is replying to this question. If this component is rendered with `ElementRenderer` or `MessageSpace`, this value will be set automatically.',
  },
  conversationId: {
    description:
      'ID of the current conversation. If this component is rendered with `ElementRenderer` or `MessageSpace`, this value will be set automatically.',
  },
  messageId: {
    description:
      'ID of the message of this question. If this component is rendered with `ElementRenderer` or `MessageSpace`, this value will be set automatically.',
  },
}

export default meta

const options = ['Yes', 'Maybe', 'No']

const conversationData = {
  currentUser: 'You',
  conversationId: '1',
  messageId: '1',
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

export const InMessageSpace = {
  args: {
    ...conversationData,
    title: 'What do you think?',
    description:
      'The description supports **markdown**! Choose either of the options *below*.',
    options: options,
  },
  decorators: [
    (Story: StoryFn) => {
      const [selectedOption, setSelectedOption] = useState('')

      return (
        <div style={{ maxWidth: '400px' }}>
          <MessageCanvas
            message={{
              id: '1',
              sender: 'Agent',
              timestamp: new Date().toISOString(),
              conversationId: '1',
              format: 'question',
              data: {},
            }}
          >
            <Story
              args={{
                description:
                  'Choose an option to see how it works in `MessageSpace`.',
                options,
                ...conversationData,
                ws: {
                  send: (selection: Message) =>
                    setSelectedOption(selection.data.text),
                },
              }}
            />
          </MessageCanvas>
          {selectedOption.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <MessageCanvas
                message={{
                  id: '2',
                  sender: 'You',
                  timestamp: new Date().toISOString(),
                  conversationId: '1',
                  format: 'text',
                  data: {
                    text: selectedOption,
                  },
                }}
              >
                {selectedOption}
              </MessageCanvas>
            </div>
          )}
        </div>
      )
    },
  ],
}
