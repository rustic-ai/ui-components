import './multimodalInput.css'

import Box from '@mui/material/Box'
import { useState } from 'react'
import React from 'react'

import type { FileInfo, InputProps, Message } from '../../../types'
import BaseInput from '../../baseInput/baseInput'
import FilePreview from '../filePreview/filePreview'
import Uploader from '../uploader'

export default function MultimodalInput(props: InputProps) {
  const [addedFiles, setAddedFiles] = useState<FileInfo[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [pendingUploadCount, setPendingUploadCount] = useState(0)
  const hasUploadedFiles = addedFiles.length > 0 && pendingUploadCount === 0

  function handleSendMessage(formattedMessage: Message): void {
    if (hasUploadedFiles) {
      formattedMessage.data = {
        file_count: addedFiles.length,
      }
    }
    props.ws.send(formattedMessage)
    setAddedFiles([])
  }

  function handleDelete(id: string, fileController: AbortController): void {
    setErrorMessages([])
    setAddedFiles((prev) => prev.filter((file) => file.id !== id))
    setPendingUploadCount((prev) => (prev === 0 ? prev : prev - 1))
    fileController.abort()

    const xhr = new XMLHttpRequest()
    xhr.open('DELETE', `${props.deleteFileEndpoint}${id}`)
    xhr.send()
  }

  const isSendButtonDisabled =
    addedFiles.length === 0 || pendingUploadCount !== 0

  return (
    <Box className="rustic-multimodal-input">
      <BaseInput
        {...props}
        send={handleSendMessage}
        isSendEnabled={!isSendButtonDisabled}
        errorMessages={errorMessages}
        setErrorMessages={setErrorMessages}
      >
        <Box sx={{ flex: '1 1 auto' }}>
          <Box className="rustic-files" sx={{ border: '1px solid #ccc' }}>
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
          <Box className="rustic-bottom-buttons">
            <Uploader
              setAddedFiles={setAddedFiles}
              uploadFileEndpoint={props.uploadFileEndpoint}
              addedFiles={addedFiles}
              acceptedFileTypes={props.acceptedFileTypes}
              setErrorMessages={setErrorMessages}
              setPendingUploadCount={setPendingUploadCount}
              maxFileSize={props.maxFileSize}
              maxFileCount={props.maxFileCount}
            />
          </Box>
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
