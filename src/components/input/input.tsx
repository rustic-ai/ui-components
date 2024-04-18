import './input.css'

import SendIcon from '@mui/icons-material/Send'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import FilePreview from '../filePreview/filePreview'
import type { FileInfo, InputProps, Message } from '../types'
import Uploader from './uploader'

export default function Input(props: InputProps) {
  const [messageText, setMessageText] = useState<string>('')
  const [addedFiles, setAddedFiles] = useState<FileInfo[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [pendingUploadCount, setPendingUploadCount] = useState(0)
  const isEmptyMessage = !messageText.trim().length
  const hasUploadedFiles = addedFiles.length > 0 && pendingUploadCount === 0
  function handleSendMessage(): void {
    if (!isEmptyMessage || hasUploadedFiles) {
      const currentTime = new Date().toISOString()

      const formattedMessage: Message = {
        id: getUUID(),
        timestamp: currentTime,
        sender: props.sender,
        format: 'text',
        conversationId: props.conversationId,
        data: {},
      }

      if (addedFiles.length > 0) {
        const files = addedFiles.map((file) => {
          return { name: file.name, url: file.url }
        })
        formattedMessage.format = 'files'
        formattedMessage.data = {
          description: messageText,
          files: files,
        }
      } else {
        formattedMessage.data = {
          text: messageText,
        }
      }
      props.ws.send(formattedMessage)
      setMessageText('')
      setAddedFiles([])
      setErrorMessages([])
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

  function handleDelete(id: string, fileController: AbortController) {
    setErrorMessages([])
    setAddedFiles((prev) => prev.filter((file) => file.id !== id))
    setPendingUploadCount((prev) => (prev === 0 ? prev : prev - 1))
    fileController.abort()
    props.onFileDelete(id)
  }

  const isSendButtonDisabled =
    (isEmptyMessage && addedFiles.length === 0) || pendingUploadCount !== 0

  return (
    <Box className="rustic-input-container">
      {errorMessages.map((errorMessage, index) => (
        <Typography
          variant="caption"
          color="error"
          className="rustic-error-message"
          key={index}
          data-cy="error-message"
        >
          {errorMessage}
        </Typography>
      ))}
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
              {addedFiles.length > 0 &&
                addedFiles.map((file, index) => (
                  <FilePreview
                    key={index}
                    name={file.name}
                    onDelete={() => handleDelete(file.id, file.abortController)}
                    loadingProgress={file.loadingProgress}
                  />
                ))}
            </Box>
          ),
        }}
      />
      <Box className="rustic-bottom-buttons">
        <Uploader
          setAddedFiles={setAddedFiles}
          onFileAdd={props.onFileAdd}
          addedFiles={addedFiles}
          acceptedFileTypes={props.acceptedFileTypes}
          setErrorMessages={setErrorMessages}
          setPendingUploadCount={setPendingUploadCount}
          maxFileSize={props.maxFileSize}
          maxFileCount={props.maxFileCount}
        />
        <IconButton
          data-cy="send-button"
          aria-label="send message"
          onClick={handleSendMessage}
          disabled={isSendButtonDisabled}
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
