import React from 'react'

import { ElementRenderer, type ThreadableMessage } from '..'
import Icon from '../icon'
import Text from '../text/text'
import CopyText from './actions/copy/copyText'
import MessageCanvas from './messageCanvas'

export default {
  title: 'Rustic UI/Message Canvas/Message Canvas',
  component: MessageCanvas,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

const mockWsClient = {
  send: () => {},
  close: () => {},
  reconnect: () => {},
}

const commonElementRendererProps = {
  ws: mockWsClient,
  sender: 'You',
  conversationId: '1',
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

const messageString = `{
    conversationId: 'lkd9vc',
    data: {
      text: 'Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.'
    },
    format: 'text',
    id: '1',
    sender: 'Scheduling agent',
    timestamp: '2020-01-02T00:00:00.000Z',
    topicId: 'default'
  }`

const elementRendererString = `<ElementRenderer
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
    />`

const profileString = `(message: ThreadableMessage) => {
    if (message.sender.includes('agent')) return <SmartToyIcon />
    else return <AccountCircleIcon />
  }`

const getProfileComponent = (message: ThreadableMessage) => {
  if (message.sender.includes('agent')) {
    return <Icon name="smart_toy" />
  } else {
    return <Icon name="account_circle" />
  }
}
export const WithProfileIcon = {
  args: {
    children: (
      <ElementRenderer
        message={messageFromHuman}
        supportedElements={{ text: Text }}
        {...commonElementRendererProps}
      />
    ),
    message: messageFromHuman,
    getProfileComponent,
  },
  parameters: {
    docs: {
      source: {
        code: `<MessageCanvas
  getProfileComponent={${profileString}}
  message={${messageString}}
  >
    ${elementRendererString}
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
        {...commonElementRendererProps}
      />
    ),
    message: messageFromAgent,
  },
  parameters: {
    docs: {
      source: {
        code: `<MessageCanvas
  message={${messageString}}
  >
    ${elementRendererString}
</MessageCanvas>`,
      },
    },
  },
}

export const WithCopyIcon = {
  args: {
    children: (
      <ElementRenderer
        message={messageFromHuman}
        supportedElements={{ text: Text }}
        {...commonElementRendererProps}
      />
    ),
    message: messageFromHuman,
    getProfileComponent,
    getActionsComponent: (message: ThreadableMessage) => {
      const copyButton = message.format === 'text' && (
        <CopyText message={message} />
      )
      if (copyButton) {
        return <>{copyButton}</>
      }
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<MessageCanvas
  getProfileComponent={${profileString}}
  getActionsComponent={(message: ThreadableMessage) => {
    const copyButton = message.format === 'text' && <CopyText message={message} />
    if (copyButton) {
      return <>{copyButton}</>
    }
  }}
  message={${messageString}}
  >
    ${elementRendererString}
</MessageCanvas>`,
      },
    },
  },
}
