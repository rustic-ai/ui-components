import './uploader.css'

import IconButton from '@mui/material/IconButton'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { FileInfo } from '../../types'

export type UploaderProps = {
  addedFiles: FileInfo[]
  setAddedFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>
  uploadFileEndpoint: string
  setErrorMessages: React.Dispatch<React.SetStateAction<string[]>>
  setPendingUploadCount: React.Dispatch<React.SetStateAction<number>>
  acceptedFileTypes?: string
  maxFileSize?: number
  maxFileCount?: number
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
  const inputId = getUUID()

  function getFilesToAdd(
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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.setErrorMessages([])

    const files = event.target.files && Array.from(event.target.files)
    const totalFileCount = props.addedFiles.length + (files ? files.length : 0)

    if (props.maxFileCount && totalFileCount > props.maxFileCount) {
      props.setErrorMessages((prevMessages) => [
        ...prevMessages,
        `You can only upload up to ${props.maxFileCount} files.`,
      ])
    }

    const maybeFilesToAdd =
      files && getFilesToAdd(files, totalFileCount, props.maxFileCount)

    if (maybeFilesToAdd) {
      props.setPendingUploadCount((prev) => prev + maybeFilesToAdd.length)

      maybeFilesToAdd.forEach((file) => {
        const isFileSizeExceedingLimit =
          props.maxFileSize && file.size > props.maxFileSize

        function rejectFile() {
          props.setPendingUploadCount((prev) => prev - 1)

          props.setErrorMessages((prevMessages) => [
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
            id: fileId,
            abortController: controller,
          }
          props.setAddedFiles((prev) => [...prev, newAddedFile])

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
                props.setAddedFiles((prevFiles) => {
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
                  const response =
                    xhr.responseText && JSON.parse(xhr.responseText)
                  if (xhr.status === successStatus) {
                    resolve(response)
                  } else if (xhr.status !== 0) {
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
              props.setAddedFiles((prevFiles) => {
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
              props.setErrorMessages((prevMessages) => [
                ...prevMessages,
                `Failed to upload ${file.name}. ${
                  error?.message ? error.message : ''
                }`,
              ])
              props.setAddedFiles((prevFiles) => {
                return prevFiles.filter((item) => item.id !== fileId)
              })
            })
            .finally(() => {
              props.setPendingUploadCount((prev) => prev - 1)
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
    <div className="rustic-uploader">
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
    </div>
  )
}

export default Uploader
