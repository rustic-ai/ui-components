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
  const filePreviewRef = useRef<HTMLDivElement>(null)
  const errorMessagesRef = useRef<HTMLDivElement>(null)
  const filePreviewContainerId = getUUID()
  const errorContainerId = getUUID()

  const hasAddedFiles = fileCount > 0
  function handleFileCountChange(fileCountChange: 1 | -1) {
    setFileCount((prev) => prev + fileCountChange)
  }

  function handleSendMessage(formattedMessage: Message): void {
    if (hasAddedFiles) {
      formattedMessage.id = messageId
    }
    props.ws.send(formattedMessage)
    setMessageId(getUUID())
  }

  useEffect(() => {
    if (filePreviewRef.current) {
      const filePreviewContainer = document.getElementById(
        filePreviewContainerId
      )

      if (filePreviewContainer) {
        filePreviewContainer.appendChild(filePreviewRef.current)
      }
    }
  }, [filePreviewRef.current])

  useEffect(() => {
    if (errorMessagesRef.current) {
      const errorContainer = document.getElementById(errorContainerId)

      if (errorContainer) {
        errorContainer.appendChild(errorMessagesRef.current)
      }
    }
  }, [errorMessagesRef.current])

  return (
    <>
      <Box className="rustic-multimodal-input">
        <div id={errorContainerId}></div>
        <BaseInput
          {...props}
          send={handleSendMessage}
          isSendEnabled={hasAddedFiles}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Box
              id={filePreviewContainerId}
              sx={{ border: '1px solid #ccc' }}
            ></Box>
            <Box className="rustic-bottom-buttons">
              <Upload
                acceptedFileTypes={props.acceptedFileTypes}
                maxFileCount={props.maxFileCount}
                maxFileSize={props.maxFileSize}
                uploadFileEndpoint={props.uploadFileEndpoint}
                deleteFileEndpoint={props.deleteFileEndpoint}
                handleFileCountChange={handleFileCountChange}
                messageId={messageId}
                filePreviewRef={filePreviewRef}
                errorMessagesRef={errorMessagesRef}
              />
            </Box>
          </Box>
        </BaseInput>
      </Box>
    </>
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
