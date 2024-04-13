import './transcript.css'

import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import React from 'react'

interface TranscriptProps {
  transcript: string
}

export default function Transcript(props: TranscriptProps) {
  const isFullscreen = !!document.fullscreenElement

  return (
    <Box className="rustic-transcript-container">
      {!isFullscreen && (
        <Box className="rustic-transcript-header">
          <Divider orientation="vertical" flexItem />
          <Typography variant="overline" color="text.secondary">
            Transcript
          </Typography>
        </Box>
      )}
      <Typography
        className="rustic-transcript-content"
        data-cy="transcript"
        variant="body2"
      >
        {props.transcript}
      </Typography>
    </Box>
  )
}
