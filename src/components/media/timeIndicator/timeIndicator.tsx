/* eslint-disable no-magic-numbers */
import './timeIndicator.css'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

import { formatDurationTime } from '../../helper'

interface TimeIndicatorProps {
  elapsedTimeInSeconds: number
  durationTimeInSeconds: number
  style?: 'wide' | 'condensed'
}

export default function TimeIndicator(props: TimeIndicatorProps) {
  const formattedElapsedTime = formatDurationTime(props.elapsedTimeInSeconds)
  const formattedDuration = formatDurationTime(props.durationTimeInSeconds)

  const formattedTimeDisplay = `${formattedElapsedTime} / ${formattedDuration}`

  if (props.style === 'wide') {
    return (
      <Box className="rustic-time-container">
        <Typography variant="overline">{formattedElapsedTime}</Typography>
        <Typography variant="overline">{formattedDuration}</Typography>
      </Box>
    )
  } else {
    return (
      <Typography variant="overline" className="rustic-time-display">
        {formattedTimeDisplay}
      </Typography>
    )
  }
}

TimeIndicator.defaultProps = {
  style: 'condensed',
}
