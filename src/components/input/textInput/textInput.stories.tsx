import type { Meta, StoryFn } from '@storybook/react'
import React from 'react'

import { wsDescription } from '../../sharedDescription'
import type { BaseInputProps, WebSocketClient } from '../../types'
import type { Message } from '../../types'
import BaseInput from '../baseInput/baseInput'
import TextInput from './textInput'

interface InputProps extends BaseInputProps {
  ws: WebSocketClient
}

const meta: Meta<React.FC<InputProps>> = {
  title: 'Rustic UI/Input/Text Input',
  component: BaseInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      argTypes: {
        exclude: ['send', 'isSendEnabled'],
      },
      source: {
        transform: (code: string) => {
          let textInputCode = code.replaceAll('BaseInput', 'TextInput')
          textInputCode = textInputCode.replaceAll(
            '  component={() => {}}\n',
            ''
          )
          textInputCode = textInputCode.replaceAll(
            'send={() => {}}',
            'ws:{send: (message: Message) => alert(`Message sent: ${message.data.text}`)}'
          )
          return textInputCode
        },
      },
    },
  },
  decorators: [
    (Story: StoryFn) => (
      <div style={{ width: 'clamp(250px, 50vw, 500px)' }}>
        <Story />
      </div>
    ),
  ],
}

meta.argTypes = {
  ...meta.argTypes,
  ws: wsDescription,
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
}

export default meta

export const Default = {
  args: {
    component: TextInput,
    sender: { id: '169snlk9n', name: 'Some User' },
    conversationId: '1',
    placeholder: 'Type your message',
    emojiDataSource: '/emoji/data.json',
    send: (message: Message) => alert(`Message sent: ${message.data.text}`),
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
