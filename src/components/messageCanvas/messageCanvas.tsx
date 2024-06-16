import './messageCanvas.css'

import { useTheme } from '@mui/material'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import React, { forwardRef, type ReactNode } from 'react'

import Timestamp from '../timestamp/timestamp'
import type { ThreadableMessage } from '../types'

export interface MessageContainerProps {
  /** A function that returns a React element to display sender details, like names and/or avatars. */
  getProfileComponent?: (message: ThreadableMessage) => ReactNode
  /** A function that returns a single React element which may be composed of several actions supported for the message, such as editing, copying, and deleting, etc.
   * In case no actions are applicable or available for a particular message, the function may return `undefined`.
   * This approach offers flexibility in tailoring message interactions to specific application requirements.
   * To define individual message actions, developers can extend the `Action` component's functionality.
   * One such example is the `CopyText` component.
   */
  getActionsComponent?: (message: ThreadableMessage) => ReactNode | undefined
}

export interface MessageCanvasProps extends MessageContainerProps {
  /** Message information to be displayed. Please see the `MessageSpace` docs for more information about the `ThreadableMessage` interface. */
  message: ThreadableMessage
  /** React component to be displayed in the message canvas. */
  children: ReactNode
}

/**
 The `MessageCanvas` component serves as a container for displaying messages within a chat interface.
 It provides a structured layout for rendering message content along with sender information and timestamp details.
 This component is designed to encapsulate individual message items and facilitate consistent rendering of messages within an application.
 */
function MessageCanvasElement(
  props: MessageCanvasProps,
  ref: React.Ref<HTMLDivElement>
) {
  const theme = useTheme()

  return (
    <Stack
      id={props.message.id}
      className="rustic-message-canvas"
      data-cy="message-canvas"
      ref={ref}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {props.getProfileComponent && props.getProfileComponent(props.message)}
        <Timestamp timestamp={props.message.timestamp} />
      </Stack>
      {props.getActionsComponent &&
        props.getActionsComponent(props.message) && (
          <Card
            variant="outlined"
            className="rustic-message-actions-container"
            sx={{ boxShadow: theme.shadows[1] }}
          >
            {props.getActionsComponent(props.message)}
          </Card>
        )}
      <Card variant="outlined" className="rustic-message-container">
        {props.children}
      </Card>
    </Stack>
  )
}

const MessageCanvas = forwardRef(MessageCanvasElement)
export default MessageCanvas
