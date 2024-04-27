import './multimodalInput.css'

import Box from '@mui/material/Box'
import { useRef, useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { Message, MultimodalInputProps } from '../../../types'
import BaseInput from '../../baseInput/baseInput'
import Upload from '../upload/upload'

export default function MultimodalInput(props: MultimodalInputProps) {
  const [fileCount, setFileCount] = useState(0)
  // const messageIdRef = useRef<string>(getUUID())
  const [messageId, setMessageId] = useState(getUUID())
  const filePreviewRef = useRef<HTMLDivElement>(null)
  const errorMessagesRef = useRef<HTMLDivElement>(null)

  const hasAddedFiles = fileCount > 0
  function handleFileCountChange(fileCountChange: 1 | -1) {
    setFileCount((prev) => prev + fileCountChange)
  }
  function handleSendMessage(formattedMessage: Message): void {
    if (hasAddedFiles) {
      formattedMessage.id = messageId
      // formattedMessage.id = messageIdRef.current
    }
    props.ws.send(formattedMessage)
    setMessageId(getUUID())
    // messageIdRef.current = getUUID()
  }

  const filePreviewContainerStyle = fileCount && {
    border: '1px solid #ccc',
    borderTop: 'none',
    borderBottomLeftRadius: '16px',
    borderBottomRightRadius: '16px',
  }

  return (
    <>
      <Box className="rustic-multimodal-input">
        <div ref={errorMessagesRef}></div>
        <BaseInput
          {...props}
          send={handleSendMessage}
          isSendEnabled={hasAddedFiles}
        >
          <Box
            className="rustic-file-preview-container"
            ref={filePreviewRef}
            sx={filePreviewContainerStyle}
          />
          <Box className="rustic-bottom-buttons">
            <Upload
              acceptedFileTypes={props.acceptedFileTypes}
              maxFileCount={props.maxFileCount}
              maxFileSize={props.maxFileSize}
              uploadFileEndpoint={props.uploadFileEndpoint}
              deleteFileEndpoint={props.deleteFileEndpoint}
              handleFileCountChange={handleFileCountChange}
              messageId={messageId}
              // messageId={messageIdRef.current}
              filePreviewRef={filePreviewRef.current}
              errorMessagesRef={errorMessagesRef.current}
            />
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
