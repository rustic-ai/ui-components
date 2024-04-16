import './filePreview.css'

import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import React from 'react'

import { getShortenString } from '../helper'
import type { FileInfo } from '../input/input'

type FilePreview = {
  name: string
  id: string
  setAddedFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>
  onFileDelete: () => Promise<{ isDeleted: boolean }>
  loadingProgress: number
  setErrorMessages: React.Dispatch<React.SetStateAction<string[]>>
}

function FilePreview(props: FilePreview) {
  const maximumFileNameLength = 15
  const maximumLoadingProgress = 100
  function handleDelete() {
    props.setErrorMessages([])
    props.setAddedFiles((prev) => prev.filter((file) => file.id !== props.id))
    props.onFileDelete()
  }

  return (
    <Card className="rustic-file-preview">
      <Typography variant="subtitle2">
        {getShortenString(props.name, maximumFileNameLength)}
      </Typography>

      <Box className="rustic-flex-center">
        {props.loadingProgress < maximumLoadingProgress && (
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={props.loadingProgress}
            className="rustic-upload-progress"
          />
        )}
        <IconButton
          color="primary"
          onClick={handleDelete}
          className="rustic-delete-button"
        >
          <span className="material-symbols-rounded">cancel</span>
        </IconButton>
      </Box>
    </Card>
  )
}

export default FilePreview
