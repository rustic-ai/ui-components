import './messageSpace.css'

import Box from '@mui/system/Box'
import type { ReactNode } from 'react'
import React from 'react'

import ElementRenderer from '../elementRenderer/elementRenderer'
import MessageCanvas from '../messageCanvas/messageCanvas'
import type { ComponentMap, MessageProps, ThreadableMessage } from '../types'

export interface MessageSpaceProps {
  supportedElements: ComponentMap
  messages?: ThreadableMessage[]
  getActionsComponent?: (message: MessageProps) => ReactNode
  getProfileComponent?: (message: MessageProps) => ReactNode
}

const MessageSpace = (props: MessageSpaceProps) => {
  return (
    <Box data-cy="message-space" className="rustic-message-space">
      {props.messages &&
        props.messages.length > 0 &&
        props.messages.map((message) => {
          return (
            <MessageCanvas
              key={message.id}
              message={message}
              getActionsComponent={props.getActionsComponent}
              getProfileComponent={props.getProfileComponent}
            >
              <ElementRenderer
                message={message}
                supportedElements={props.supportedElements}
              />
            </MessageCanvas>
          )
        })}
    </Box>
  )
}

export default MessageSpace
