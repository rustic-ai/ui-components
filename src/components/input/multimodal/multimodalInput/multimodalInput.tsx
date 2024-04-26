import './multimodalInput.css'

import Box from '@mui/material/Box'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { InputProps, Message } from '../../../types'
import BaseInput from '../../baseInput/baseInput'
import Upload from '../upload/upload'

export default function MultimodalInput(props: InputProps) {
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [fileCount, setFileCount] = useState(0)
  const messageIdRef = useRef<string>(getUUID())
  const filePreviewRef = useRef<HTMLDivElement>(null)
  const errorMessagesRef = useRef<HTMLDivElement>(null)

  const hasAddedFiles = fileCount > 0
  function handleFileCountChange(fileCountChange: 1 | -1) {
    setFileCount((prev) => prev + fileCountChange)
  }

  function handleSendMessage(formattedMessage: Message): void {
    if (hasAddedFiles) {
      formattedMessage.id = messageIdRef.current
    }
    props.ws.send(formattedMessage)
    messageIdRef.current = getUUID()
  }

  useEffect(() => {
    if (filePreviewRef.current) {
      const filePreviewContainer = document.getElementById(
        'filePreviewContainer'
      )

      if (filePreviewContainer) {
        filePreviewContainer.appendChild(filePreviewRef.current)
      }
    }
  }, [filePreviewRef.current])

  useEffect(() => {
    if (errorMessagesRef.current) {
      const errorContainer = document.getElementById('errorContainer')

      if (errorContainer) {
        errorContainer.appendChild(errorMessagesRef.current)
      }
    }
  }, [errorMessagesRef.current])

  return (
    <>
      <Box className="rustic-multimodal-input">
        <div id="errorContainer"></div>
        <BaseInput
          {...props}
          send={handleSendMessage}
          isSendEnabled={hasAddedFiles}
          multimodalErrorMessages={errorMessages}
          setMultimodalErrorMessages={setErrorMessages}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Box
              id="filePreviewContainer"
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
                messageId={messageIdRef.current}
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
