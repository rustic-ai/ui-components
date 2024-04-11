import './filePreview.css'

import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React from 'react'

import { getShortenString } from '../helper'

type FilePreview = {
  file: File
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>
}

function FilePreview(props: FilePreview) {
  const maximumFileNameLength = 15

  function handleDelete() {
    props.setSelectedFiles((prev) => prev.filter((file) => file !== props.file))
  }

  return (
    <Card className="rustic-file-preview">
      <Typography variant="subtitle2">
        {getShortenString(props.file.name, maximumFileNameLength)}
      </Typography>
      <IconButton
        color="primary"
        onClick={handleDelete}
        className="rustic-delete-button"
      >
        <span className="material-symbols-rounded">cancel</span>
      </IconButton>
    </Card>
  )
}

export default FilePreview
