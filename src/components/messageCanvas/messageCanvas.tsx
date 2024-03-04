import './messageCanvas.css'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import type { ReactNode } from 'react'
import React from 'react'

import Timestamp from '../timestamp/timestamp'
import type { ThreadableMessage } from '../types'

export interface MessageCanvasProps {
  /** Message information to be displayed. Please see the `MessageSpace` docs for more information about the `ThreadableMessage` interface. */
  message: ThreadableMessage
  /** React component to be displayed in the message canvas. */
  children: ReactNode
  /** Interactions with the message. For example, this could be a list of buttons for different actions (e.g. copy, delete, save, etc.) */
  messageInteractions?: (message: ThreadableMessage) => ReactNode
}

export default function MessageCanvas(props: MessageCanvasProps) {
  return (
    <Box id={props.message.id} className="rustic-message-canvas">
      <Typography variant="body1" data-cy="sender">
        {props.message.sender}:
      </Typography>
      <Card variant="outlined" className="rustic-message-canvas-card">
        {props.children}
      </Card>
      {props.message.lastThreadMessage && (
        <Typography variant="caption">last updated: </Typography>
      )}
      <Timestamp
        timestamp={
          props.message.lastThreadMessage?.timestamp || props.message.timestamp
        }
      />
      {props.messageInteractions && props.messageInteractions(props.message)}
    </Box>
  )
}
