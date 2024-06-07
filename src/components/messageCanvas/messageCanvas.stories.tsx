import React from 'react'

import { ElementRenderer, type ThreadableMessage } from '..'
import Icon from '../icon/icon'
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
  sender: { name: 'You', id: '16usbj' },
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
  sender: { name: 'Scheduling agent', id: 'bh1hbjkidjn' },
}

const messageFromHuman = {
  ...baseMessage,
  sender: { name: 'Some sender', id: '1562ajosn' },
}

const messageString = JSON.stringify({
  ...baseMessage,
  sender: messageFromAgent.sender,
})

const elementRendererString = `<ElementRenderer
      message={messageFromAgent}
      supportedElements={{ text: Text }}
    />`

const profileString = `(message: ThreadableMessage) => {
    if (message.sender.includes('agent')) return <SmartToyIcon />
    else return <AccountCircleIcon />
  }`

const getProfileComponent = (message: ThreadableMessage) => {
  if (message.sender.name.includes('agent')) {
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
