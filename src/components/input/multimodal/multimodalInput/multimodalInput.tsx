import './multimodalInput.css'

import Box from '@mui/material/Box'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { Message, MultimodalInputProps } from '../../../types'
import BaseInput from '../../baseInput/baseInput'
import Upload from '../upload/upload'

export default function MultimodalInput(props: MultimodalInputProps) {
  const [fileCount, setFileCount] = useState(0)
  const [messageId, setMessageId] = useState(getUUID())
  const filePreviewRef = useRef<HTMLDivElement>()
  const errorMessagesRef = useRef<HTMLDivElement>()
  const inputRef = useRef<HTMLDivElement>(null)
  const hasAddedFiles = fileCount > 0

  function handleFileCountChange(fileCountChange: 1 | -1) {
    setFileCount((prev) => prev + fileCountChange)
  }

  useEffect(() => {
    if (inputRef.current) {
      errorMessagesRef.current = inputRef.current.querySelector(
        '.rustic-error-container'
      ) as HTMLDivElement
      filePreviewRef.current = inputRef.current.querySelector(
        '.rustic-end-adornment'
      ) as HTMLDivElement
    }
  })

  function handleSendMessage(formattedMessage: Message): void {
    if (hasAddedFiles) {
      formattedMessage.id = messageId
    }

    props.ws.send(formattedMessage)
    setMessageId(getUUID())
  }

  return (
    <Box className="rustic-multimodal-input">
      <BaseInput
        {...props}
        send={handleSendMessage}
        isSendEnabled={hasAddedFiles}
        ref={inputRef}
      >
        <Box className="rustic-file-preview-container" ref={filePreviewRef} />
        <Box className="rustic-bottom-buttons">
          <Upload
            acceptedFileTypes={props.acceptedFileTypes}
            maxFileCount={props.maxFileCount}
            maxFileSize={props.maxFileSize}
            uploadFileEndpoint={props.uploadFileEndpoint}
            deleteFileEndpoint={props.deleteFileEndpoint}
            handleFileCountChange={handleFileCountChange}
            messageId={messageId}
            filePreviewRef={filePreviewRef.current}
            errorMessagesRef={errorMessagesRef.current}
          />
        </Box>
      </BaseInput>
    </Box>
  )
}

const oneMb = 1024
const two = 2

MultimodalInput.defaultProps = {
  multiline: true,
  fullWidth: true,
  maxRows: 6,
  maxFileSize: oneMb * oneMb * two,
  maxFileCount: 1,
}
