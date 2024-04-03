import './transcript.css'

import { useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import React from 'react'

interface TranscriptProps {
  title?: string
  transcript: string
}

export default function Transcript(props: TranscriptProps) {
  const theme = useTheme()
  return (
    <>
      <Typography
        className="rustic-transcript-header"
        variant="overline"
        color="text.secondary"
        sx={{ borderLeft: `4px solid ${theme.palette.divider}` }}
      >
        {props.title}
      </Typography>
      <Typography data-cy="transcript" variant="body2">
        {props.transcript}
      </Typography>
    </>
  )
}

Transcript.defaultProps = {
  title: 'Transcript',
}
