import './multimodalInput.css'
import '../../../../index.css'

import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import { toChatRequest } from '../../../helper'
import type { FileData, Message, MultimodalInputProps } from '../../../types'
import BaseInput from '../../baseInput/baseInput'
import Uploader from '../uploader/uploader'

/** The `MultimodalInput` component  is designed to serve as a foundation for accommodating diverse input modes in conversational apps. Currently, it supports sending text as well as files. The text messages, are directly sent via the WebSocket while for files, it uses a combination of HTTP APIs and the WebSocket.
 
__How does file upload work?__

1. Users can select files to send alongside text messages.
2. Selected files are sent to a designated HTTP API.
3. The HTTP API can update the upload progress for each file and is responsible for transforming and storing the files securely.
4. Once uploaded, the file names are appended to the data sent over WebSocket. Files can also be deleted after being uploaded and an HTTP API is sent to delete the file from storage.
5. The backend server of the application utilizes the uploaded files along with the text messages for message processing. 

* **Note**: `emoji-picker-element`, `emoji-picker-element-data` and `uuid` are not bundled, so please install the following packages using npm:
* 
* ```typescript
* npm i emoji-picker-element emoji-picker-element-data uuid
* ```
*/
export default function MultimodalInput(props: MultimodalInputProps) {
  const [filesInfo, setFilesInfo] = useState<FileData[]>([])
  const [messageId, setMessageId] = useState(getUUID())
  const [filePreviewsContainer, setFilePreviewsContainer] =
    useState<HTMLDivElement>()
  const [errorMessagesContainer, setErrorMessagesContainer] =
    useState<HTMLDivElement>()
  const inputRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
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
      formattedMessage.format = 'ChatCompletionRequest'
      if (filesInfo) {
        formattedMessage.data = toChatRequest(
          formattedMessage.data.text,
          filesInfo.map((file) => `${file.url}`)
        )
      }
    }

    props.ws.send(formattedMessage)
    setMessageId(getUUID())
    setFilesInfo([])
  }

  return (
    <Box
      className="rustic-multimodal-input"
      sx={{
        border: `1px solid ${theme.palette.action.disabled}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        ':focus-within': {
          borderColor: theme.palette.secondary.main,
        },
        background: theme.palette.background.paper,
      }}
    >
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
            showFullName={props.showFullName}
            getUploadData={props.getUploadData}
            uploadOptions={props.uploadOptions}
            listFiles={props.listFiles}
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
