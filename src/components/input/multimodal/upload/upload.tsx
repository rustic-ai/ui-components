import './upload.css'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'
import { v4 as getUUID } from 'uuid'

import { shortenString } from '../../../helper'
import type { FileInfo, UploaderProps } from '../../../types'

const successStatus = 200
const maximumFileNameLength = 15
const maximumLoadingProgress = 100

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

function Upload(props: UploaderProps) {
  const [addedFiles, setAddedFiles] = useState<FileInfo[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const inputId = getUUID()

  useEffect(() => {
    setAddedFiles([])
    setErrorMessages([])
  }, [props.messageId])

  function rejectFile(fileName: string) {
    setErrorMessages((prevMessages) => [
      ...prevMessages,
      `Failed to upload ${fileName}. You cannot upload files larger than ${
        props.maxFileSize && getFileSizeAbbrev(props.maxFileSize)
      }.`,
    ])
  }

  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
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
      maybeFilesToAdd.forEach((file) => {
        handleFile(file)
      })
    }
    event.target.value = ''
  }

  function handleFile(file: File) {
    const isFileSizeExceedingLimit =
      props.maxFileSize && file.size > props.maxFileSize

    if (isFileSizeExceedingLimit) {
      rejectFile(file.name)
    } else {
      uploadFile(file)
    }
  }

  function updateProgress(loadedPercentage: number, id: string) {
    setAddedFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) => {
        if (file.id === id) {
          return {
            ...file,
            loadingProgress: loadedPercentage,
          }
        }
        return file
      })
      return updatedFiles
    })
  }

  function handleSuccessfulUpload(res: { fileId: string }, id: string) {
    setAddedFiles((prevFiles) => {
      const index = prevFiles.findIndex((file) => file.id === id)
      if (index !== -1) {
        const updatedFiles = [...prevFiles]
        updatedFiles[index] = {
          ...updatedFiles[index],
          fileId: res.fileId,
        }
        return updatedFiles
      }
      return prevFiles
    })
  }

  function handleFailedUpload(
    fileName: string,
    id: string,
    response?: { message?: string }
  ) {
    setErrorMessages((prevMessages) => [
      ...prevMessages,
      `Failed to upload ${fileName}. ${response?.message || ''}`,
    ])
    setAddedFiles((prev) => prev.filter((file) => file.id !== id))
  }

  function uploadFile(file: File) {
    const formData = new FormData()
    const controller = new AbortController()
    formData.append('file', file)

    const id = getUUID()
    const newAddedFile = {
      name: file.name,
      loadingProgress: 0,
      abortController: controller,
      id: id,
    }

    setAddedFiles((prev) => [...prev, newAddedFile])

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${props.uploadFileEndpoint}message?id=${props.messageId}`)
    xhr.upload.onprogress = (progressEvent: ProgressEvent) => {
      const percentageConversionRate = 100
      const loadedPercentage =
        (progressEvent.loaded / progressEvent.total) * percentageConversionRate
      updateProgress(loadedPercentage, id)
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const response = xhr.responseText ? JSON.parse(xhr.responseText) : ''
        if (xhr.status === successStatus) {
          handleSuccessfulUpload(response, id)
        } else if (xhr.status !== 0) {
          props.handleFileCountChange(-1)
          handleFailedUpload(file.name, id, response)
        }
      } else if (xhr.readyState === XMLHttpRequest.OPENED) {
        //no response in here
        handleFailedUpload(file.name, id)
        props.handleFileCountChange(-1)
      }
    }

    xhr.send(formData)
    props.handleFileCountChange(1)
    controller.signal.addEventListener('abort', () => {
      xhr.abort()
    })
  }

  function deleteFile(fileId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open(
        'DELETE',
        `${props.deleteFileEndpoint}file?message-id=${props.messageId}&file-id=${fileId}`
      )

      xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === successStatus) {
            resolve()
          } else if (xhr.status !== 0) {
            reject()
          }
        } else if (xhr.readyState === XMLHttpRequest.OPENED) {
          reject()
        }
      }
      xhr.send()
    })
  }

  function handleDelete(file: FileInfo, index: number) {
    setErrorMessages([])
    props.handleFileCountChange(-1)
    if (file.fileId) {
      deleteFile(file.fileId)
        .then(() => {
          return setAddedFiles((prev) => prev.filter((_, i) => i !== index))
        })
        .catch(() => {
          props.handleFileCountChange(1)
          return setErrorMessages((prevMessages) => [
            ...prevMessages,
            `Failed to delete ${file.name}. Please try again.`,
          ])
        })
    } else {
      file.abortController.abort()
      setAddedFiles((prev) => prev.filter((_file, i) => i !== index))
    }
  }

  function renderFilePreview(file: FileInfo, index: number) {
    return (
      <Card className="rustic-file-preview" key={index}>
        <Typography variant="subtitle2" data-cy="file-name">
          {shortenString(file.name, maximumFileNameLength)}
        </Typography>

        <Box className="rustic-flex-center">
          {file.loadingProgress < maximumLoadingProgress && (
            <LinearProgress
              variant="determinate"
              color="secondary"
              value={file.loadingProgress}
              className="rustic-upload-progress"
            />
          )}
          <IconButton
            data-cy="delete-button"
            color="primary"
            onClick={() => handleDelete(file, index)}
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
          onChange={handleFilesChange}
          multiple
          accept={props.acceptedFileTypes}
        />
      </Box>
      <Box ref={props.errorMessagesRef}>
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
      </Box>

      <Box className="rustic-files" ref={props.filePreviewRef}>
        {addedFiles.map((file, index) => renderFilePreview(file, index))}
      </Box>
    </>
  )
}

export default Upload
