import './transcriptToggle.css'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React from 'react'

interface TranscriptToggleProps {
  isTranscriptShown: boolean
  setIsTranscriptShown: () => void
}

export default function TranscriptToggle(props: TranscriptToggleProps) {
  return (
    <Button
      className="rustic-transcript-toggle"
      data-cy="transcript-toggle"
      size="small"
      onClick={props.setIsTranscriptShown}
      endIcon={
        props.isTranscriptShown ? (
          <KeyboardArrowUpIcon />
        ) : (
          <KeyboardArrowDownIcon />
        )
      }
    >
      <Typography variant="overline">
        {props.isTranscriptShown ? 'Hide' : 'Show'} Transcript
      </Typography>
    </Button>
  )
}
