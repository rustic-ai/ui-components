import './messageCanvas.css'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import React from 'react'

import Timestamp from '../timestamp/timestamp'
import type { MessageCanvasProps } from '../types'

/**
 The `MessageCanvas` component serves as a container for displaying messages within a chat interface.
 It provides a structured layout for rendering message content along with sender information and timestamp details.
 This component is designed to encapsulate individual message items and facilitate consistent rendering of messages within an application.
 */
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
        {props.getActionsComponent &&
          props.getActionsComponent(props.message) && (
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
