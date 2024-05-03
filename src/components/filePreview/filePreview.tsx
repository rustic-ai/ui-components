import './filePreview.css'

import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React from 'react'

import { shortenString } from '../helper'
import type { FileData } from '../types'

export interface FilePreviewProps {
  file: FileData
}

export default function FilePreview(
  props: React.PropsWithChildren<FilePreviewProps>
) {
  const theme = useTheme()
  const maximumFileNameLength = 15
  return (
    <Card
      className="rustic-file-preview"
      data-cy="file-preview"
      variant="outlined"
      sx={{ boxShadow: theme.shadows[1] }}
    >
      <Typography variant="subtitle2" data-cy="file-name">
        {shortenString(props.file.name, maximumFileNameLength)}
      </Typography>
      {props.children}
    </Card>
  )
}
