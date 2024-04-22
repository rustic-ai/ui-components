import './uploader.css'

import IconButton from '@mui/material/IconButton'
import React, { type ChangeEvent } from 'react'
import { v4 as getUUID } from 'uuid'

export type UploaderProps = {
  acceptedFileTypes?: string
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function Uploader(props: UploaderProps) {
  const inputId = getUUID()

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
        onChange={props.handleFileChange}
        multiple
        accept={props.acceptedFileTypes}
      />
    </div>
  )
}

export default Uploader
