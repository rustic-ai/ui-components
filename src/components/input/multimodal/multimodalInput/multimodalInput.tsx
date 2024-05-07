import './multimodalInput.css'
import '../../../../index.css'

import Box from '@mui/material/Box'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { FileData, Message, MultimodalInputProps } from '../../../types'
import BaseInput from '../../baseInput/baseInput'
import Uploader from '../uploader/uploader'

/** The `MultimodalInput` component is a versatile form element that facilitates various types of user input. In addition to supporting text input, it empowers users to upload files seamlessly and efficiently. Designed to be flexible and adaptable, the `MultimodalInput` component serves as a foundation for accommodating diverse input requirements.

__Explainaton of File Upload Process:__
1. Client sends the files to server via REST APIs.
2. Server transforms the files (or send them to cloud storage service for the transformation).
3. Server saves the files to cloud storage service e.g. AWS S3.
4. Server responds back to the client with urls.
5. Client sends the links via WebSocket.
6. WebSocket broadcasts the links to other users in the same chat.
7. Client renders the links in the chat. */
export default function MultimodalInput(props: MultimodalInputProps) {
  const [filesInfo, setFilesInfo] = useState<FileData[]>([])
  const [messageId, setMessageId] = useState(getUUID())
  const [filePreviewsContainer, setFilePreviewsContainer] =
    useState<HTMLDivElement>()
  const [errorMessagesContainer, setErrorMessagesContainer] =
    useState<HTMLDivElement>()
  const inputRef = useRef<HTMLDivElement>(null)
  const hasAddedFiles = filesInfo.length > 0

  function handleFileUpdates(action: 'add' | 'remove', fileName: string) {
    if (action === 'add') {
      setFilesInfo((prev) => [...prev, { name: fileName }])
    } else {
      setFilesInfo((prev) => prev.filter((file) => file.name !== fileName))
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
      formattedMessage.data.files = filesInfo
    }

    props.ws.send(formattedMessage)
    setMessageId(getUUID())
    setFilesInfo([])
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
