import '../uploader/uploader.css'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
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

const successStatus = 200
const maximumFileNameLength = 15
const maximumLoadingProgress = 100

function Upload(props: UploaderProps) {
  const [addedFiles, setAddedFiles] = useState<FileInfo[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const inputId = getUUID()

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

  function updateProgress(loadedPercentage: number, fileId: string) {
    setAddedFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) => {
        if (file.fileId === fileId) {
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

  function handleSuccessfulUpload(
    res: { url: string; id: string },
    fileId: string
  ) {
    setAddedFiles((prevFiles) => {
      const index = prevFiles.findIndex((file) => file.fileId === fileId)
      if (index !== -1) {
        const updatedFiles = [...prevFiles]
        updatedFiles[index] = {
          ...updatedFiles[index],
          url: res.url,
          id: res.id,
        }
        return updatedFiles
      }
      return prevFiles
    })
  }

  function handleFailedUpload(
    fileName: string,
    fileId: string,
    response?: { message?: string }
  ) {
    setErrorMessages((prevMessages) => [
      ...prevMessages,
      `Failed to upload ${fileName}. ${response?.message || ''}`,
    ])
    setAddedFiles((prev) => prev.filter((file) => file.fileId !== fileId))
  }

  function uploadFile(file: File) {
    const formData = new FormData()
    const controller = new AbortController()
    formData.append('file', file)

    const fileId = getUUID()
    const newAddedFile = {
      name: file.name,
      loadingProgress: 0,
      abortController: controller,
      fileId: fileId,
    }

    setAddedFiles((prev) => [...prev, newAddedFile])

    const xhr = new XMLHttpRequest()
    xhr.open('POST', props.uploadFileEndpoint)
    xhr.upload.onprogress = (progressEvent: ProgressEvent) => {
      const percentageConversionRate = 100
      const loadedPercentage =
        (progressEvent.loaded / progressEvent.total) * percentageConversionRate
      updateProgress(loadedPercentage, fileId)
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const response = xhr.responseText ? JSON.parse(xhr.responseText) : ''
        if (xhr.status === successStatus) {
          handleSuccessfulUpload(response, fileId)
        } else if (xhr.status !== 0) {
          handleFailedUpload(file.name, fileId, response)
        }
      } else if (xhr.readyState === XMLHttpRequest.OPENED) {
        //no response in here
        handleFailedUpload(file.name, fileId)
      }
    }

    xhr.send(formData)
    controller.signal.addEventListener('abort', () => {
      xhr.abort()
    })
  }

  function deleteFile(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('DELETE', `${props.deleteFileEndpoint}${id}`)
      xhr.onload = () => {
        if (xhr.status === successStatus) {
          resolve()
        } else {
          reject()
        }
      }

      xhr.send()
    })
  }

  function handleDelete(index: number, file: FileInfo) {
    setErrorMessages([])

    if (file.id) {
      deleteFile(file.id)
        .then(() => setAddedFiles((prev) => prev.filter((_, i) => i !== index)))
        .catch(() =>
          setErrorMessages((prevMessages) => [
            ...prevMessages,
            `Failed to delete ${file.name}. Please try again.`,
          ])
        )
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
            onClick={() => handleDelete(index, file)}
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
        {addedFiles.map((file, index) => renderFilePreview(file, index))}
      </Box>
    </>
  )
}

export default Upload
