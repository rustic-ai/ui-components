import './messageSpace.css'

import Box from '@mui/system/Box'
import React from 'react'

import ElementRenderer from '../elementRenderer/elementRenderer'
import MessageCanvas from '../messageCanvas/messageCanvas'
import type { MessageSpaceProps } from '../types'

/**
 The `MessageSpace` component uses `MessageCanvas` and `ElementRenderer` to render a list of messages. It serves as a container for individual message items, each encapsulated within a `MessageCanvas` for consistent styling and layout. \n\n Note: For more information about the `getActionsComponent` and `getProfileComponent` fields, refer to the [MessageCanvas' docs](http://localhost:6006/?path=/docs/rustic-ui-message-canvas-message-canvas--docs).
 */
export default function MessageSpace(props: MessageSpaceProps) {
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
