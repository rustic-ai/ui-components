import './filePreview.css'

import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React from 'react'

import { getShortenString } from '../helper'
import type { FileInfo } from '../input/input'

type FilePreview = {
  name: string
  id: string
  setAddedFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>
  onFileDelete: (fileId: string) => Promise<{ isDeleted: boolean }>
}

function FilePreview(props: FilePreview) {
  const maximumFileNameLength = 15

  function handleDelete() {
    props.setAddedFiles((prev) => prev.filter((file) => file.id !== props.id))
    props.onFileDelete(props.id)
  }

  return (
    <Card className="rustic-file-preview">
      <Typography variant="subtitle2">
        {getShortenString(props.name, maximumFileNameLength)}
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
