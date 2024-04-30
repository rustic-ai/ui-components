import './uploader.css'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { AxiosProgressEvent } from 'axios'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { v4 as getUUID } from 'uuid'

import { shortenString } from '../../../helper'
import type { UploaderProps } from '../../../types'

const maximumFileNameLength = 15
const maximumLoadingProgress = 100

interface FileInfo {
  id: string
  name: string
  loadingProgress: number
  abortController: AbortController
}

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

function Uploader(props: UploaderProps) {
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
        `You can only upload ${props.maxFileCount} files.`,
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
    setAddedFiles((existingFiles) => {
      const index = existingFiles.findIndex((file) => file.id === id)
      if (index !== -1) {
        const updatedFiles = [...existingFiles]
        updatedFiles[index] = {
          ...updatedFiles[index],
          id: res.fileId,
        }
        return updatedFiles
      }
      return existingFiles
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

    const temporaryFileId = getUUID()
    const newAddedFile = {
      name: file.name,
      loadingProgress: 0,
      abortController: controller,
      id: temporaryFileId,
    }

    setAddedFiles((prev) => [...prev, newAddedFile])

    props.handleFileCountChange(1)

    function handleUploadProgress(progressEvent: AxiosProgressEvent) {
      const percentageConversionRate = 100
      if (progressEvent.total) {
        const loadedPercentage =
          (progressEvent.loaded / progressEvent.total) *
          percentageConversionRate
        updateProgress(loadedPercentage, temporaryFileId)
      }
    }

    const uploadUrl = `${props.uploadFileEndpoint}?message-id=${props.messageId}`
    axios
      .post(uploadUrl, formData, {
        onUploadProgress: handleUploadProgress,
        signal: controller.signal,
      })
      .then((response) => {
        handleSuccessfulUpload(response.data, temporaryFileId)
      })
      .catch((error) => {
        props.handleFileCountChange(-1)
        handleFailedUpload(file.name, temporaryFileId, error.response?.data)
      })
  }

  function handleDelete(file: FileInfo, index: number) {
    setErrorMessages([])
    props.handleFileCountChange(-1)
    if (file.loadingProgress === maximumLoadingProgress) {
      const deleteUrl = `${props.deleteFileEndpoint}?message-id=${props.messageId}&file-id=${file.id}`
      axios
        .delete(deleteUrl)
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
          <Tooltip title="Delete">
            <IconButton
              data-cy="delete-button"
              color="primary"
              onClick={() => handleDelete(file, index)}
              className="rustic-delete-button"
              aria-label="cancel file upload"
            >
              <span className="material-symbols-rounded">cancel</span>
            </IconButton>
          </Tooltip>
        </Box>
      </Card>
    )
  }

  const filePreviews = (
    <Box className="rustic-files">
      {addedFiles.map((file, index) => renderFilePreview(file, index))}
    </Box>
  )

  const errors = (
    <Box>
      {errorMessages.map((errorMessage, index) => (
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
  )

  function renderContentWithRef(
    content: JSX.Element,
    domNode?: HTMLDivElement | null
  ) {
    if (domNode) {
      return createPortal(content, domNode)
    } else {
      return content
    }
  }

  return (
    <>
      <Box className="rustic-uploader">
        <label htmlFor={inputId} data-cy="upload-button">
          <Tooltip title="Upload">
            <IconButton
              component="span"
              aria-label="Upload file"
              color="primary"
            >
              <span className="material-symbols-rounded">upload_2</span>
            </IconButton>
          </Tooltip>
        </label>
        <input
          type="file"
          id={inputId}
          onChange={handleFilesChange}
          multiple
          accept={props.acceptedFileTypes}
        />
      </Box>
      {errorMessages.length > 0 &&
        renderContentWithRef(errors, props.errorMessagesContainer)}
      {addedFiles.length > 0 &&
        renderContentWithRef(filePreviews, props.filePreviewsContainer)}
    </>
  )
}
export default Uploader
