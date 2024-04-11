import './input.css'

import SendIcon from '@mui/icons-material/Send'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import FilePreview from '../filePreview/filePreview'
import type { TextInput } from '../textInput/textInput'
import type { Message } from '../types'
import Uploader from './uploader'

export interface Input extends TextInput {
  acceptedFileTypes?: string
}

export default function Input(props: Input) {
  const [messageText, setMessageText] = useState<string>('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const isEmptyMessage = !messageText.trim().length

  function handleSendMessage(): void {
    if (!isEmptyMessage || selectedFiles.length > 0) {
      const currentTime = new Date().toISOString()

      const formattedMessage: Message = {
        id: getUUID(),
        timestamp: currentTime,
        sender: props.sender,
        format: 'text',
        conversationId: props.conversationId,
        data: {},
      }

      if (selectedFiles.length > 0) {
        formattedMessage.format = 'files'
        formattedMessage.data = {
          description: messageText,
          files: selectedFiles,
        }
      } else {
        formattedMessage.data = {
          text: messageText,
        }
      }
      props.ws.send(formattedMessage)
      setMessageText('')
      setSelectedFiles([])
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
    <Box className="rustic-input-container">
      <TextField
        data-cy="text-input"
        className="rustic-text-input"
        variant="outlined"
        value={messageText}
        label={props.label}
        placeholder={props.placeholder}
        maxRows={props.maxRows}
        multiline={props.multiline}
        fullWidth={props.fullWidth}
        onKeyDown={handleKeyDown}
        onChange={handleOnChange}
        color="secondary"
        size="small"
        InputProps={{
          endAdornment: (
            <Box className="rustic-files">
              {selectedFiles.length > 0 &&
                selectedFiles.map((file, index) => (
                  <FilePreview
                    key={index}
                    file={file}
                    setSelectedFiles={setSelectedFiles}
                  />
                ))}
            </Box>
          ),
        }}
      />
      <Box className="rustic-bottom-buttons">
        <Uploader setSelectedFiles={setSelectedFiles} />
        <IconButton
          data-cy="send-button"
          aria-label="send message"
          onClick={handleSendMessage}
          disabled={isEmptyMessage && selectedFiles.length === 0}
          color="primary"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

Input.defaultProps = {
  multiline: true,
  fullWidth: true,
  maxRows: 6,
}
