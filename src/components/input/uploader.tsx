import './uploader.css'

import IconButton from '@mui/material/IconButton'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { FileInfo } from './input'

export type UploaderProps = {
  addedFiles: FileInfo[]
  setAddedFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>
  onFileAdd: (
    file: File,
    fileId: string,
    onUploadProcess: (progressEvent: ProgressEvent) => void,
    fileInfo: FileInfo
  ) => Promise<{ url: string }>
  setErrorMessages: React.Dispatch<React.SetStateAction<string[]>>
  setPendingUploadCount: React.Dispatch<React.SetStateAction<number>>
  acceptedFileTypes?: string
  maxFileSize?: number
  maxFileCount?: number
}

function getFileSizeAbbrev(bytes: number): string {
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

    function getFilesToAdd() {
      if (props.maxFileCount) {
        if (totalFileCount <= props.maxFileCount) {
          return files
        } else {
          return files?.slice(0, props.maxFileCount - totalFileCount)
        }
      } else {
        return files
      }
    }

    const filesToAdd = getFilesToAdd()
    filesToAdd &&
      props.setPendingUploadCount((prev) => prev + filesToAdd.length)

    filesToAdd?.forEach((file) => {
      if (props.maxFileSize && file.size > props.maxFileSize) {
        props.setPendingUploadCount((prev) => prev - 1)

        props.setErrorMessages((prevMessages) => [
          ...prevMessages,
          `Failed to upload ${file.name}. You cannot upload files larger than ${props.maxFileSize && getFileSizeAbbrev(props.maxFileSize)}.`,
        ])
      } else {
        const fileId = getUUID()

        const onUploadProgress = (progressEvent: ProgressEvent) => {
          const percentageConversionRate = 100
          const loadedPecentage =
            (progressEvent.loaded / progressEvent.total) *
            percentageConversionRate

          props.setAddedFiles((prevFiles) => {
            const fileIndex = prevFiles.findIndex((item) => item.id === fileId)
            if (fileIndex !== -1) {
              const updatedFiles = [...prevFiles]
              updatedFiles[fileIndex] = {
                ...updatedFiles[fileIndex],
                loadingProgress: loadedPecentage,
              }
              return updatedFiles
            }
            return prevFiles
          })
        }
        const controller = new AbortController()
        const newAddedFile = {
          name: file.name,
          loadingProgress: 0,
          id: fileId,
          controller,
        }
        props.setAddedFiles((prev) => [...prev, newAddedFile])

        props
          .onFileAdd(file, fileId, onUploadProgress, newAddedFile)
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
              `Failed to upload ${file.name}. ${error?.message ? error.message : ''}`,
            ])
            props.setAddedFiles((prevFiles) => {
              return prevFiles.filter((item) => item.id !== fileId)
            })
          })
          .finally(() => {
            props.setPendingUploadCount((prev) => prev - 1)
          })
      }
    })
  }

  return (
    <div className="rustic-uploader">
      <label htmlFor={inputId}>
        <IconButton component="span" aria-label="Upload file" color="primary">
          <span className="material-symbols-rounded">attach_file</span>
        </IconButton>
      </label>
      <input
        type="file"
        id={inputId}
        onChange={handleFileChange}
        multiple
        accept={props.acceptedFileTypes}
        className="rustic-input"
      />
    </div>
  )
}

export default Uploader
