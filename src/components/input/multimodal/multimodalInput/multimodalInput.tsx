import './multimodalInput.css'

import Box from '@mui/material/Box'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { Message, MultimodalInputProps } from '../../../types'
import BaseInput from '../../baseInput/baseInput'
import Uploader from '../uploader/uploader'

export default function MultimodalInput(props: MultimodalInputProps) {
  const [fileCount, setFileCount] = useState(0)
  const [messageId, setMessageId] = useState(getUUID())
  const [filePreviewContainer, setFilePreviewContainer] =
    useState<HTMLDivElement>()
  const [errorMessagesContainer, setErrorMessagesContainer] =
    useState<HTMLDivElement>()
  const inputRef = useRef<HTMLDivElement>(null)
  const hasAddedFiles = fileCount > 0

  function handleFileCountChange(fileCountChange: 1 | -1) {
    setFileCount((prev) => prev + fileCountChange)
  }

  useEffect(() => {
    if (inputRef.current) {
      //classNames are from BaseInput component
      setErrorMessagesContainer(
        inputRef.current.querySelector(
          '.rustic-error-container'
        ) as HTMLDivElement
      )

      setFilePreviewContainer(
        inputRef.current.querySelector(
          '.rustic-end-adornment'
        ) as HTMLDivElement
      )
    }
  })

  function handleSendMessage(formattedMessage: Message): void {
    if (hasAddedFiles) {
      formattedMessage.id = messageId
    }

    props.ws.send(formattedMessage)
    setMessageId(getUUID())
    setFileCount(0)
  }

  return (
    <Box className="rustic-multimodal-input">
      <BaseInput
        {...props}
        send={handleSendMessage}
        isSendEnabled={hasAddedFiles}
        ref={inputRef}
      >
        <Box className="rustic-bottom-buttons">
          <Uploader
            acceptedFileTypes={props.acceptedFileTypes}
            maxFileCount={props.maxFileCount}
            maxFileSize={props.maxFileSize}
            uploadFileEndpoint={props.uploadFileEndpoint}
            deleteFileEndpoint={props.deleteFileEndpoint}
            handleFileCountChange={handleFileCountChange}
            messageId={messageId}
            filePreviewContainer={filePreviewContainer}
            errorMessagesContainer={errorMessagesContainer}
          />
        </Box>
      </BaseInput>
    </Box>
  )
}

const twoMB = 2097152

MultimodalInput.defaultProps = {
  multiline: true,
  fullWidth: true,
  maxRows: 6,
  maxFileSize: twoMB,
  maxFileCount: 1,
}
