import FileCopyIcon from '@mui/icons-material/FileCopy'
import IconButton from '@mui/material/IconButton'
import React from 'react'

import { ElementRenderer, type ThreadableMessage } from '..'
import Text from '../text/text'
import MessageCanvas from './messageCanvas'

export default {
  title: 'Rustic UI/Message Canvas/Message Canvas',
  component: MessageCanvas,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The `Message Canvas` component serves as a container for displaying messages within a chat interface. It provides a structured layout for rendering message content along with sender information and timestamp details. This component is designed to encapsulate individual message items and facilitate consistent rendering of messages within an application.',
      },
    },
  },
}

const message = {
  id: '1',
  timestamp: '2020-01-02T00:00:00.000Z',
  sender: 'Some Sender',
  conversationId: 'lkd9vc',
  topicId: 'default',
  format: 'text',
  data: {
    text: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
  },
}

export const Default = {
  args: {
    children: (
      <ElementRenderer message={message} supportedElements={{ text: Text }} />
    ),
    message,
  },
}

export const WithCopyFunction = {
  args: {
    children: (
      <ElementRenderer message={message} supportedElements={{ text: Text }} />
    ),
    message,
    messageInteractions: (message: ThreadableMessage) => {
      return (
        <IconButton
          color="inherit"
          aria-label="copy to clipboard"
          onClick={() => {
            if (message.data.text) {
              navigator.clipboard.writeText(message.data.text)
            }
          }}
        >
          <FileCopyIcon />
        </IconButton>
      )
    },
  },
}
