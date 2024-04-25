import './multimodalInput.css'

import Box from '@mui/material/Box'
import { useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { FileInfo, InputProps, Message } from '../../../types'
import BaseInput from '../../baseInput/baseInput'
import FilePreview from '../filePreview/filePreview'
// import Upload from '../upload/upload'
import Uploader from '../uploader/uploader'

export function getFilesToAdd(
  files: File[],
  totalFileCount: number,
  maxFileCount?: number
): File[] | undefined {
  if (maxFileCount) {
    if (totalFileCount <= maxFileCount) {
      return files
    } else {
      return files.slice(0, maxFileCount - totalFileCount)
    }
  } else {
    return files
  }
}

export function getFileSizeAbbrev(bytes: number): string {
  const units = ['Bytes', 'KB', 'MB', 'GB']
  let unitIndex = 0

  const byteConversionRate = 1024
  while (bytes >= byteConversionRate && unitIndex < units.length - 1) {
    bytes /= byteConversionRate
    unitIndex++
  }

  const formattedString = bytes.toFixed(1).toString().replace(/\.0$/, '')
  return `${formattedString} ${units[unitIndex]}`
}

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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    setErrorMessages([])

    const files = event.target.files && Array.from(event.target.files)
    const totalFileCount = addedFiles.length + (files ? files.length : 0)

    if (props.maxFileCount && totalFileCount > props.maxFileCount) {
      setErrorMessages((prevMessages) => [
        ...prevMessages,
        `You can only upload up to ${props.maxFileCount} files.`,
      ])
    }

    const maybeFilesToAdd =
      files && getFilesToAdd(files, totalFileCount, props.maxFileCount)

    if (maybeFilesToAdd) {
      setPendingUploadCount((prev) => prev + maybeFilesToAdd.length)

      maybeFilesToAdd.forEach((file) => {
        const isFileSizeExceedingLimit =
          props.maxFileSize && file.size > props.maxFileSize

        function rejectFile() {
          setPendingUploadCount((prev) => prev - 1)

          setErrorMessages((prevMessages) => [
            ...prevMessages,
            `Failed to upload ${file.name}. You cannot upload files larger than ${
              props.maxFileSize && getFileSizeAbbrev(props.maxFileSize)
            }.`,
          ])
        }

        function addFile() {
          const fileId = getUUID()
          const formData = new FormData()
          formData.append('file', file)
          formData.append('fileId', fileId)
          const controller = new AbortController()
          const newAddedFile = {
            name: file.name,
            loadingProgress: 0,
            fileId: fileId,
            abortController: controller,
          }
          setAddedFiles((prev) => [...prev, newAddedFile])

          function uploadFile(): Promise<{ url: string }> {
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest()
              xhr.open('POST', `${props.uploadFileEndpoint}`)
              xhr.upload.onprogress = (progressEvent: ProgressEvent) => {
                const percentageConversionRate = 100
                const loadedPercentage =
                  (progressEvent.loaded / progressEvent.total) *
                  percentageConversionRate

                //update the loading progress of the file in the addedFiles state
                setAddedFiles((prevFiles) => {
                  const currentFileIndex = prevFiles.findIndex(
                    (item) => item.id === fileId
                  )
                  const isFileInAddedFiles = currentFileIndex !== -1
                  if (isFileInAddedFiles) {
                    const updatedFiles = [...prevFiles]
                    updatedFiles[currentFileIndex] = {
                      ...updatedFiles[currentFileIndex],
                      loadingProgress: loadedPercentage,
                    }
                    return updatedFiles
                  }
                  return prevFiles
                })
              }

              xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                  const successStatus = 200
                  const response = xhr.responseText
                    ? JSON.parse(xhr.responseText)
                    : ''
                  if (xhr.status === successStatus) {
                    resolve(response)
                  } else if (xhr.status === 0) {
                    reject('Task canceled')
                  } else {
                    reject(response)
                  }
                } else if (xhr.readyState === XMLHttpRequest.OPENED) {
                  reject()
                }
              }

              xhr.send(formData)

              controller.signal.addEventListener('abort', () => {
                xhr.abort()
              })
            })
          }

          uploadFile()
            .then((res) => {
              setAddedFiles((prevFiles) => {
                const fileIndex = prevFiles.findIndex(
                  (item) => item.id === fileId
                )
                if (fileIndex !== -1) {
                  const updatedFiles = [...prevFiles]
                  updatedFiles[fileIndex] = {
                    ...updatedFiles[fileIndex],
                    url: res.url,
                  }
                  return updatedFiles
                }
                return prevFiles
              })
            })
            .catch((error) => {
              if (error !== 'Task canceled') {
                setErrorMessages((prevMessages) => [
                  ...prevMessages,
                  `Failed to upload ${file.name}. ${
                    error?.message ? error.message : ''
                  }`,
                ])
                setAddedFiles((prevFiles) => {
                  return prevFiles.filter((item) => item.id !== fileId)
                })
              }
            })
            .finally(() => {
              setPendingUploadCount((prev) => prev - 1)
            })
        }

        if (isFileSizeExceedingLimit) {
          rejectFile()
        } else {
          addFile()
        }
      })
    }
    event.target.value = ''
  }

  return (
    <Box className="rustic-multimodal-input">
      <BaseInput
        {...props}
        send={handleSendMessage}
        isSendEnabled={!isSendButtonDisabled}
        multimodalErrorMessages={errorMessages}
        setMultimodalErrorMessages={setErrorMessages}
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
              acceptedFileTypes={props.acceptedFileTypes}
              handleFileChange={handleFileChange}
            />
            {/* <Upload
              acceptedFileTypes={props.acceptedFileTypes}
              maxFileCount={props.maxFileCount}
              maxFileSize={props.maxFileSize}
              uploadFileEndpoint={props.uploadFileEndpoint}
              deleteFileEndpoint={props.deleteFileEndpoint}
            /> */}
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
