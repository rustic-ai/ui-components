import './uploader.css'

import IconButton from '@mui/material/IconButton'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { FileInfo } from './input'

export type UploaderProps = {
  addedFiles: FileInfo[]
  setAddedFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>
  acceptedFileTypes?: string
  onFileAdd: (file: File, fileId: string) => Promise<{ url: string }>
  setErrorMessages: React.Dispatch<React.SetStateAction<string[]>>
  setPendingUploadCount: React.Dispatch<React.SetStateAction<number>>
}

function Uploader(props: UploaderProps) {
  const inputId = getUUID()
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    props.setErrorMessages([])

    const files = event.target.files && Array.from(event.target.files)

    files && props.setPendingUploadCount((prev) => prev + files.length)
    files?.forEach((file) => {
      const fileId = getUUID()
      props.setAddedFiles((prev) => [
        ...prev,
        { name: file.name, loadingProgress: 0, id: fileId },
      ])

      props
        .onFileAdd(file, fileId)
        .then((res) => {
          props.setAddedFiles((prevFiles) => {
            const fileIndex = prevFiles.findIndex((item) => item.id === fileId)
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
