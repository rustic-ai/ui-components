import './multimodalInput.css'

import Box from '@mui/material/Box'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { Message, MultimodalInputProps } from '../../../types'
import BaseInput from '../../baseInput/baseInput'
import Uploader from '../uploader/uploader'

export default function MultimodalInput(props: MultimodalInputProps) {
  const [fileNames, setFileNames] = useState<string[]>([])
  const [messageId, setMessageId] = useState(getUUID())
  const [filePreviewsContainer, setFilePreviewsContainer] =
    useState<HTMLDivElement>()
  const [errorMessagesContainer, setErrorMessagesContainer] =
    useState<HTMLDivElement>()
  const inputRef = useRef<HTMLDivElement>(null)
  const hasAddedFiles = fileNames.length > 0

  function handleFileUpdates(action: 'add' | 'remove', fileName: string) {
    if (action === 'add') {
      setFileNames((prev) => [...prev, fileName])
    } else {
      setFileNames((prev) => prev.filter((file) => file !== fileName))
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      //classNames are from BaseInput component
      setErrorMessagesContainer(
        inputRef.current.querySelector(
          '.rustic-error-container'
        ) as HTMLDivElement
      )

      setFilePreviewsContainer(
        inputRef.current.querySelector('.rustic-input-extras') as HTMLDivElement
      )
    }
  })

  function handleSendMessage(formattedMessage: Message): void {
    if (hasAddedFiles) {
      formattedMessage.id = messageId
      formattedMessage.format = 'multipart'
      formattedMessage.data.files = fileNames
    }

    props.ws.send(formattedMessage)
    setMessageId(getUUID())
    setFileNames([])
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
            onFileUpdate={handleFileUpdates}
            messageId={messageId}
            filePreviewsContainer={filePreviewsContainer}
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
