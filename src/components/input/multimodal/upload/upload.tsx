import '../uploader/uploader.css'

import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import React, { useState } from 'react'
import { v4 as getUUID } from 'uuid'

import { shortenString } from '../../../helper'
import type { FileInfo } from '../../../types'
import {
  getFileSizeAbbrev,
  getFilesToAdd,
} from '../multimodalInput/multimodalInput'

export type UploaderProps = {
  acceptedFileTypes?: string
  maxFileCount?: number
  maxFileSize?: number
  uploadFileEndpoint: string
  deleteFileEndpoint: string
  filesRef?: React.Ref<HTMLDivElement>
}

function Upload(props: UploaderProps) {
  const [addedFiles, setAddedFiles] = useState<FileInfo[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  //   const [pendingUploadCount, setPendingUploadCount] = useState(0)

  const inputId = getUUID()
  const maximumFileNameLength = 15
  const maximumLoadingProgress = 100

  function resolveUpload(fileId: string, url: string) {
    setAddedFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) =>
        file.id === fileId ? { ...file, url: url } : file
      )
      return updatedFiles
    })
  }

  function rejectFile(fileName: string) {
    //   setPendingUploadCount((prev) => prev - 1)

    setErrorMessages((prevMessages) => [
      ...prevMessages,
      `Failed to upload ${fileName}. You cannot upload files larger than ${
        props.maxFileSize && getFileSizeAbbrev(props.maxFileSize)
      }.`,
    ])
  }

  function handleUpload(file: File) {
    const isFileSizeExceedingLimit =
      props.maxFileSize && file.size > props.maxFileSize

    function addFile() {
      const fileId = getUUID()
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileId', fileId)
      const controller = new AbortController()
      const newAddedFile = {
        name: file.name,
        loadingProgress: 0,
        id: fileId,
        abortController: controller,
      }
      setAddedFiles((prev) => [...prev, newAddedFile])

      function uploadFile(): Promise<{ url: string }> {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('POST', `${props.uploadFileEndpoint}${fileId}`)
          xhr.upload.onprogress = (progressEvent: ProgressEvent) => {
            const percentageConversionRate = 100
            const loadedPercentage =
              (progressEvent.loaded / progressEvent.total) *
              percentageConversionRate

            //update the loading progress of the file in the addedFiles state
            setAddedFiles((prevFiles) => {
              const updatedFiles = prevFiles.map((file) =>
                file.id === fileId
                  ? { ...file, loadingProgress: loadedPercentage }
                  : file
              )
              return updatedFiles
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
          resolveUpload(fileId, res.url)
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
      // .finally(() => {
      //   setPendingUploadCount((prev) => prev - 1)
      // })
    }

    if (isFileSizeExceedingLimit) {
      rejectFile(file.name)
    } else {
      addFile()
    }
  }

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
      //   setPendingUploadCount((prev) => prev + maybeFilesToAdd.length)
      maybeFilesToAdd.forEach(handleUpload)
    }
    event.target.value = ''
  }

  function handleDelete(id: string, fileController: AbortController): void {
    setErrorMessages([])
    setAddedFiles((prev) => prev.filter((file) => file.id !== id))
    // setPendingUploadCount((prev) => (prev === 0 ? prev : prev - 1))
    fileController.abort()

    const xhr = new XMLHttpRequest()
    xhr.open('DELETE', `${props.deleteFileEndpoint}${id}`)
    xhr.send()
  }

  function renderFilePreviw(file: FileInfo) {
    return (
      <Card className="rustic-file-preview" key={file.id}>
        <Typography variant="subtitle2" data-cy="file-name">
          {shortenString(file.name, maximumFileNameLength)}
        </Typography>

        <Box className="rustic-flex-center">
          {file.loadingProgress < maximumLoadingProgress && (
            <LinearProgress
              data-cy="loading-progress"
              variant="determinate"
              color="secondary"
              value={file.loadingProgress}
              className="rustic-upload-progress"
            />
          )}
          <IconButton
            data-cy="delete-button"
            color="primary"
            onClick={() => handleDelete(file.id, file.abortController)}
            className="rustic-delete-button"
            aria-label="cancel file upload"
          >
            <span className="material-symbols-rounded">cancel</span>
          </IconButton>
        </Box>
      </Card>
    )
  }
  return (
    <>
      <Box className="rustic-uploader">
        <label htmlFor={inputId} data-cy="upload-button">
          <IconButton component="span" aria-label="Upload file" color="primary">
            <span className="material-symbols-rounded">upload_2</span>
          </IconButton>
        </label>
        <input
          type="file"
          id={inputId}
          onChange={handleFileChange}
          multiple
          accept={props.acceptedFileTypes}
        />
      </Box>
      {errorMessages &&
        errorMessages.map((errorMessage, index) => (
          <Typography
            variant="caption"
            color="error"
            className="rustic-error-message"
            data-cy="error-message"
            key={index}
          >
            {errorMessage}
          </Typography>
        ))}
      <Box className="rustic-files" ref={props.filesRef}>
        {addedFiles.map((file) => renderFilePreviw(file))}
      </Box>
    </>
  )
}

export default Upload
