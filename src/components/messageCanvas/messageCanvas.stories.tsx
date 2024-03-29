import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SmartToyIcon from '@mui/icons-material/SmartToy'
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

const baseMessage = {
  id: '1',
  timestamp: '2020-01-02T00:00:00.000Z',

  conversationId: 'lkd9vc',
  topicId: 'default',
  format: 'text',
  data: {
    text: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.',
  },
}

const messageFromAgent = {
  ...baseMessage,
  sender: 'Scheduling agent',
}

const messageFromHuman = {
  ...baseMessage,
  sender: 'Some sender',
}

export const WithProfileIcon = {
  args: {
    children: (
      <ElementRenderer
        message={messageFromHuman}
        supportedElements={{ text: Text }}
      />
    ),
    message: messageFromHuman,
    getProfileComponent: (message: ThreadableMessage) => {
      if (message.sender.includes('agent')) {
        return <SmartToyIcon />
      } else {
        return <AccountCircleIcon />
      }
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<MessageCanvas
        getProfileComponent={(message: ThreadableMessage) => {
          if (message.sender.includes('agent')) return <SmartToyIcon />
          else return <AccountCircleIcon />
        }
        message={{
          conversationId: 'lkd9vc',
          data: {
            text: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
          },
          format: 'text',
          id: '1',
          sender: 'Scheduling agent',
          timestamp: '2020-01-02T00:00:00.000Z',
          topicId: 'default'
        }}
      >
        <ElementRenderer
          message={{
            conversationId: 'lkd9vc',
            data: {
              text: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
            },
            format: 'text',
            id: '1',
            sender: 'Scheduling agent',
            timestamp: '2020-01-02T00:00:00.000Z',
            topicId: 'default'
          }}
          supportedElements={{ text: Text }}
        />
      </MessageCanvas>`,
      },
    },
  },
}

export const NoIcon = {
  args: {
    children: (
      <ElementRenderer
        message={messageFromAgent}
        supportedElements={{ text: Text }}
      />
    ),
    message: messageFromAgent,
  },
  parameters: {
    docs: {
      source: {
        code: `<MessageCanvas
        message={{
          conversationId: 'lkd9vc',
          data: {
            text: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
          },
          format: 'text',
          id: '1',
          sender: 'Scheduling agent',
          timestamp: '2020-01-02T00:00:00.000Z',
          topicId: 'default'
        }}
      >
        <ElementRenderer
          message={{
            conversationId: 'lkd9vc',
            data: {
              text: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
            },
            format: 'text',
            id: '1',
            sender: 'Scheduling agent',
            timestamp: '2020-01-02T00:00:00.000Z',
            topicId: 'default'
          }}
          supportedElements={{ text: Text }}
        />
      </MessageCanvas>`,
      },
    },
  },
}
