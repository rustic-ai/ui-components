import './commonControls.css'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'

import { formatDurationTime } from '../../helper'
import { MediaIconButton } from './mediaIconButton'

export interface MediaControls {
  mediaElement: HTMLMediaElement
}

interface ToggleTranscriptButtonProps {
  isTranscriptShown: boolean
  setIsTranscriptShown: () => void
}

interface PlayOrPauseButtonProps extends MediaControls {
  onError: (errorMessage: string) => void
}

interface MoveTenSecondsButtonProps extends MediaControls {
  movement: 'replay' | 'forward'
}

const percentMultiple = 100

export function ProgressSlider(props: MediaControls) {
  const formattedElapsedTime = formatDurationTime(
    props.mediaElement.currentTime
  )

  function handleTimeChange(event: Event, newValue: number | number[]) {
    props.mediaElement.currentTime = newValue as number
  }

  function renderBufferedProgressBar() {
    const buffered = props.mediaElement.buffered
    let secondsBuffered = 0

    // // This loop calculates the total seconds buffered up to the current playback time by iterating through the buffered time ranges in reverse order. It finds the most recent buffered range that comes before or includes the current time and uses its end point to calculate the total buffered percentage. This ensures we capture the relevant buffered duration relative to the current playback position, even in scenarios where buffering is discontinuous or occurs in segments.
    for (let i = buffered.length - 1; i >= 0; --i) {
      const rangeStart = buffered.start(i)
      const rangeEnd = buffered.end(i)

      if (rangeStart < props.mediaElement.currentTime) {
        secondsBuffered = rangeEnd
        break
      }
    }

    const bufferedPercent =
      (secondsBuffered / props.mediaElement.duration) * percentMultiple

    return (
      <LinearProgress
        className="rustic-progress-buffered"
        variant="determinate"
        value={bufferedPercent}
      />
    )
  }

  return (
    <Box className="rustic-progress">
      {renderBufferedProgressBar()}
      <Slider
        className="rustic-progress-slider"
        data-cy="progress-slider"
        size="small"
        aria-label="Time"
        aria-valuetext={`Current time: ${formattedElapsedTime}`}
        max={props.mediaElement.duration}
        value={props.mediaElement.currentTime}
        onChange={handleTimeChange}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => formatDurationTime(value)}
        color="secondary"
      />
    </Box>
  )
}

export function VolumeSettings(props: MediaControls) {
  const [volumeFraction, setVolumeFraction] = useState(
    props.mediaElement.volume
  )
  const [previousVolume, setPreviousVolume] = useState(
    props.mediaElement.volume
  )

  const action = props.mediaElement.muted ? 'volumeOff' : 'volumeUp'

  function handleMuteToggle() {
    props.mediaElement.muted = !props.mediaElement.muted

    if (props.mediaElement.muted) {
      setPreviousVolume(props.mediaElement.volume)
      setVolumeFraction(0)
    } else {
      setVolumeFraction(previousVolume)
    }
  }

  function handleVolumeChange(
    event: Event | React.MouseEvent,
    newValue: number | number[]
  ) {
    const updatedVolume = newValue as number

    props.mediaElement.muted = updatedVolume === 0
    props.mediaElement.volume = updatedVolume as number
    setVolumeFraction(props.mediaElement.volume)
  }

  return (
    <Box className="rustic-volume-settings">
      <MediaIconButton
        onClick={handleMuteToggle}
        className="rustic-mute-button"
        action={action}
      />
      <Slider
        className="rustic-volume-slider"
        data-cy="volume-slider"
        size="small"
        max={1}
        step={0.1}
        aria-label="Volume"
        aria-valuetext={`Volume: ${volumeFraction * percentMultiple}%`}
        value={volumeFraction}
        onChange={handleVolumeChange}
      />
    </Box>
  )
}

export function ToggleTranscriptButton(props: ToggleTranscriptButtonProps) {
  const Icon = props.isTranscriptShown
    ? KeyboardArrowUpIcon
    : KeyboardArrowDownIcon

  const buttonText = `${props.isTranscriptShown ? 'Hide' : 'Show'} Transcript`

  return (
    <Button
      className="rustic-transcript-toggle"
      data-cy="transcript-toggle"
      onClick={props.setIsTranscriptShown}
      endIcon={<Icon />}
    >
      <Typography variant="overline">{buttonText}</Typography>
    </Button>
  )
}

export function PlayOrPauseButton(props: PlayOrPauseButtonProps) {
  const [isPlaying, setIsPlaying] = useState(!props.mediaElement.paused)

  const action = isPlaying ? 'pause' : 'play'

  function handlePlayOrPauseToggle() {
    if (isPlaying) {
      props.mediaElement.pause()
    } else {
      props.mediaElement
        .play()
        .then(() => {
          props.onError('')
        })
        .catch(() => {
          props.onError('Failed to play the media. Please try again.')
        })
    }
  }

  // State is updated by event listeners so that the icon is displayed correctly, even when play/pause is not initiated by the user or user initiates without direct use of this toggle (e.g. automatically pauses when picture-in-picture is exited, or pause and play can be toggled in the picture-in-picture window).
  props.mediaElement.onended = function () {
    setIsPlaying(false)
  }
  props.mediaElement.onpause = function () {
    setIsPlaying(false)
  }
  props.mediaElement.onplay = function () {
    setIsPlaying(true)
  }

  return (
    <MediaIconButton
      onClick={handlePlayOrPauseToggle}
      action={action}
      className="rustic-pause-play-icon"
    />
  )
}

export function PlaybackRateButton(props: MediaControls) {
  const [playbackRate, setPlaybackRate] = useState(
    props.mediaElement.playbackRate
  )

  function handlePlaybackRateChange() {
    let newPlaybackRate = 1
    const rateChange = 0.5
    const maxRate = 2
    // Increase playback speed by 0.5 until until 2 is reached, then reset to 1
    if (props.mediaElement.playbackRate < maxRate) {
      newPlaybackRate = props.mediaElement.playbackRate + rateChange
    }

    props.mediaElement.playbackRate = newPlaybackRate
    setPlaybackRate(newPlaybackRate)
  }

  return (
    <Button
      onClick={handlePlaybackRateChange}
      className="rustic-playback-rate-button"
      aria-label={`Playback rate: ${playbackRate}x, click to change`}
      data-cy="playback-rate-button"
    >
      <Typography variant="body1">{playbackRate}X</Typography>
    </Button>
  )
}

export function MoveTenSecondsButton(props: MoveTenSecondsButtonProps) {
  function handleForwardTenSeconds() {
    props.mediaElement.currentTime += 10
  }

  function handleReplayTenSeconds() {
    props.mediaElement.currentTime -= 10
  }

  const isReplayMovement = props.movement === 'replay'

  const onClick = isReplayMovement
    ? handleReplayTenSeconds
    : handleForwardTenSeconds

  const action = isReplayMovement ? 'replay' : 'forward'

  return <MediaIconButton onClick={onClick} action={action} />
}
