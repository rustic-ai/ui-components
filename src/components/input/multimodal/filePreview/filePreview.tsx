import './filePreview.css'

import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import React from 'react'

import { shortenString } from '../../../helper'

type FilePreview = {
  name: string
  loadingProgress: number
  onDelete: () => void
}

function FilePreview(props: FilePreview) {
  const maximumFileNameLength = 15
  const maximumLoadingProgress = 100

  return (
    <Card className="rustic-file-preview">
      <Typography variant="subtitle2" data-cy="file-name">
        {shortenString(props.name, maximumFileNameLength)}
      </Typography>

      <Box className="rustic-flex-center">
        {props.loadingProgress < maximumLoadingProgress && (
          <LinearProgress
            data-cy="loading-progress"
            variant="determinate"
            color="secondary"
            value={props.loadingProgress}
            className="rustic-upload-progress"
          />
        )}
        <IconButton
          data-cy="delete-button"
          color="primary"
          onClick={props.onDelete}
          className="rustic-delete-button"
          aria-label="cancel file upload"
        >
          <span className="material-symbols-rounded">cancel</span>
        </IconButton>
      </Box>
    </Card>
  )
}

export default FilePreview
