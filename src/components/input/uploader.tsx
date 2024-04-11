import './uploader.css'

import IconButton from '@mui/material/IconButton'
import React from 'react'
import { v4 as getUUID } from 'uuid'

export type UploaderProps = {
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>
  acceptedFileTypes?: string
}

function Uploader(props: UploaderProps) {
  const inputId = getUUID()

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files && Array.from(event.target.files)

    props.setSelectedFiles((prevFiles) => {
      return files ? [...prevFiles, ...files] : prevFiles
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
