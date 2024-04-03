import './progressSlider.css'

import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import React from 'react'

import { formatDurationTime } from '../../helper'

export type BufferRange = {
  start: number
  end: number
}

interface ProgressSliderProps {
  mediaElement: HTMLMediaElement
  bufferedRanges: BufferRange[]
  elapsedTimeInSeconds: number
  durationTimeInSeconds: number
  styles?: object
}

export default function ProgressSlider(props: ProgressSliderProps) {
  const formattedElapsedTime = formatDurationTime(props.elapsedTimeInSeconds)

  function handleTimeChange(event: Event, newValue: number | number[]) {
    props.mediaElement.currentTime = newValue as number
  }

  function renderBufferedProgressBar() {
    return props.bufferedRanges.map((range, index) => (
      <Box
        key={index}
        className="rustic-progress-buffered"
        sx={{
          backgroundColor: 'primary.light',
          // eslint-disable-next-line no-magic-numbers
          width: `${((range.end - range.start) / props.durationTimeInSeconds) * 100}%`,
        }}
      />
    ))
  }

  return (
    <Box className="rustic-progress">
      <Slider
        className="rustic-progress-slider"
        data-cy="progress-slider"
        size="small"
        aria-label="Time"
        aria-valuetext={`Current time: ${formattedElapsedTime}`}
        max={props.durationTimeInSeconds}
        value={props.elapsedTimeInSeconds}
        onChange={handleTimeChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => formatDurationTime(value)}
        sx={props.styles}
      />
      {renderBufferedProgressBar()}
    </Box>
  )
}
