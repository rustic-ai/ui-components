import './textInput.css'

import SendIcon from '@mui/icons-material/Send'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { Message, WebSocketClient } from '../types'

export interface TextInputProps {
  ws: WebSocketClient
  /** Id of the current user. */
  sender: string
  /** Id of the current conversation. */
  conversationId: string
  /** Placeholder text to be displayed in the text input box. */
  label: string
  /** Boolean that dictates whether `TextInput` can expand to be multiline. */
  multiline?: boolean
  /** Maximum number of rows to be displayed. */
  maxRows?: number
  /** Boolean that dictates whether `TextInput` takes up 100% width of the parent container. */
  fullWidth?: boolean
}

export default function TextInput(props: TextInputProps) {
  const [messageText, setMessageText] = useState<string>('')

  const isEmptyMessage = !messageText.trim().length

  function handleSendMessage(): void {
    if (!isEmptyMessage) {
      const currentTime = new Date().toISOString()

      const formattedMessage: Message = {
        id: getUUID(),
        timestamp: currentTime,
        sender: props.sender,
        conversationId: props.conversationId,
        format: 'text',
        data: { text: messageText },
      }

      props.ws.send(formattedMessage)
      setMessageText('')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setMessageText(e.target.value)
  }

  return (
    <Box className="rustic-text-input-container">
      <TextField
        data-cy="text-input"
        className="rustic-text-input"
        variant="outlined"
        value={messageText}
        label={props.label}
        maxRows={props.maxRows}
        multiline={props.multiline}
        fullWidth={props.fullWidth}
        onKeyDown={handleKeyDown}
        onChange={handleOnChange}
        sx={{
          backgroundColor: 'background.paper',
        }}
      />
      <IconButton
        data-cy="send-button"
        aria-label="send message"
        onClick={handleSendMessage}
        disabled={isEmptyMessage}
        color="primary"
      >
        <SendIcon />
      </IconButton>
    </Box>
  )
}

TextInput.defaultProps = {
  multiline: true,
  fullWidth: true,
  maxRows: 6,
}
