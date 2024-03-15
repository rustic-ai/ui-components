import './messageCanvas.css'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import type { ReactNode } from 'react'
import React from 'react'

import Timestamp from '../timestamp/timestamp'
import type { ThreadableMessage } from '../types'

export interface MessageCanvasProps {
  /** Profile icon to be shown before sender's name. */
  getProfileComponent?: (message: ThreadableMessage) => ReactNode
  /** Message information to be displayed. Please see the `MessageSpace` docs for more information about the `ThreadableMessage` interface. */
  message: ThreadableMessage
  /** React component to be displayed in the message canvas. */
  children: ReactNode
  /** Message actions. For example, this could be a list of buttons for different actions (e.g. copy, delete, save, etc.) */
  getActionsComponent?: (message: ThreadableMessage) => ReactNode
}

export default function MessageCanvas(props: MessageCanvasProps) {
  return (
    <Box
      id={props.message.id}
      className="rustic-message-canvas"
      data-cy="message-canvas"
    >
      <Box className="rustic-sender-info">
        {props.getProfileComponent && props.getProfileComponent(props.message)}
        <Typography variant="body2" color="text.secondary" data-cy="sender">
          {props.message.sender}:
        </Typography>
      </Box>
      <Card variant="outlined" className="rustic-message-actions-container">
        {props.children}
      </Card>
      <Box className="rustic-message-footer">
        {props.getActionsComponent && (
          <Card variant="outlined">
            {props.getActionsComponent(props.message)}
          </Card>
        )}
        <Box className="rustic-timestamp">
          {props.message.lastThreadMessage && (
            <Typography variant="caption">last updated: </Typography>
          )}
          <Timestamp
            timestamp={
              props.message.lastThreadMessage?.timestamp ||
              props.message.timestamp
            }
          />
        </Box>
      </Box>
    </Box>
  )
}
