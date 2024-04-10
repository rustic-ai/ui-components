import './controls.css'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'

import { formatDurationTime } from '../../helper'

interface MediaIconButtonProps {
  onClick: () => void
  action:
    | 'play'
    | 'pause'
    | 'forward'
    | 'replay'
    | 'volumeUp'
    | 'volumeOff'
    | 'pictureInPicture'
    | 'pictureInPictureExit'
    | 'fullscreen'
    | 'fullscreenExit'
    | 'captionsOn'
    | 'captionsOff'
  className?: string
  color?: string
}

interface MediaControls {
  mediaElement: HTMLMediaElement
  color?: string
}

interface Toggle {
  active: boolean
  setActive: () => void
  color?: string
}

interface FullscreenToggleProps {
  element: HTMLElement
  color?: string
}

interface MoveTenSecondsButtonProps extends MediaControls {
  movement: 'replay' | 'forward'
}

const percentMultiple = 100

export function MediaIconButton(props: MediaIconButtonProps) {
  const controls = {
    play: { symbol: 'play_circle', label: 'play' },
    pause: { symbol: 'pause_circle', label: 'pause' },
    forward: { symbol: 'forward_10', label: 'forward ten seconds' },
    replay: { symbol: 'replay_10', label: 'replay ten seconds' },
    volumeUp: { symbol: 'volume_up', label: 'mute' },
    volumeOff: { symbol: 'volume_off', label: 'unmute' },
    pictureInPicture: {
      symbol: 'picture_in_picture',
      label: 'picture in picture',
    },
    pictureInPictureExit: {
      symbol: 'picture_in_picture_off',
      label: 'exit picture in picture',
    },
    fullscreen: { symbol: 'fullscreen', label: 'fullscreen' },
    fullscreenExit: { symbol: 'fullscreen_exit', label: 'exit fullscreen' },
    captionsOn: { symbol: 'closed_caption', label: 'show captions' },
    captionsOff: { symbol: 'closed_caption_disabled', label: 'hide captions' },
  }
  return (
    <IconButton
      onClick={props.onClick}
      aria-label={`click to ${controls[props.action].label}`}
      className={props.className}
      data-cy={`${props.action}-button`}
    >
      <Icon sx={{ color: props.color }}>
        <span className="material-symbols-rounded">
          {controls[props.action].symbol}
        </span>
      </Icon>
    </IconButton>
  )
}

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

  const isMuted = props.mediaElement.muted
  const action = isMuted ? 'volumeOff' : 'volumeUp'

  props.mediaElement.onvolumechange = function () {
    if (props.mediaElement.muted) {
      setVolumeFraction(0)
    } else {
      setVolumeFraction(props.mediaElement.volume)
    }
  }

  function handleMuteToggle() {
    if (isMuted && props.mediaElement.volume === 0) {
      // If audio was muted and volume was 0, unmute and restore to full volume
      props.mediaElement.muted = false
      props.mediaElement.volume = 1
    } else if (isMuted) {
      // If audio was muted, unmute, restoring previous volume
      props.mediaElement.muted = false
    } else {
      // If audio was unmuted, mute
      props.mediaElement.muted = true
    }
  }

  function handleVolumeChange(
    event: Event | React.MouseEvent,
    newValue: number | number[]
  ) {
    const updatedVolume = newValue as number

    props.mediaElement.muted = updatedVolume === 0
    props.mediaElement.volume = updatedVolume as number
  }

  return (
    <Box className="rustic-volume-settings">
      <MediaIconButton
        onClick={handleMuteToggle}
        className="rustic-mute-button"
        action={action}
        color={props.color}
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
        sx={{ color: props.color }}
      />
    </Box>
  )
}

export function CaptionsToggle(props: Toggle) {
  const action = props.active ? 'captionsOff' : 'captionsOn'

  return <MediaIconButton onClick={props.setActive} action={action} />
}

export function TranscriptToggle(props: Toggle) {
  const Icon = props.active ? KeyboardArrowUpIcon : KeyboardArrowDownIcon

  const buttonText = `${props.active ? 'Hide' : 'Show'} Transcript`

  return (
    <Button
      className="rustic-transcript-toggle"
      data-cy="transcript-toggle"
      onClick={props.setActive}
      endIcon={<Icon sx={{ color: props.color }} />}
    >
      <Typography variant="overline" sx={{ color: props.color }}>
        {buttonText}
      </Typography>
    </Button>
  )
}

export function PausePlayToggle(props: MediaControls) {
  const [isPlaying, setIsPlaying] = useState(!props.mediaElement.paused)

  const action = isPlaying ? 'pause' : 'play'

  function handlePausePlayToggle() {
    if (isPlaying) {
      props.mediaElement.pause()
    } else {
      props.mediaElement.play()
    }
  }

  // State is updated by event listeners so that the icon is displayed correctly, even when play/pause is not initiated by the user (e.g. pause and play can be toggled in the picture-in-picture window).
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
      onClick={handlePausePlayToggle}
      action={action}
      className="rustic-pause-play-icon"
      color={props.color}
    />
  )
}

export function PictureInPictureToggle(props: MediaControls) {
  const [isPictureInPicture, setIsPictureInPicture] = useState(
    !!document.pictureInPictureElement
  )

  const videoElement = props.mediaElement as HTMLVideoElement

  const action = isPictureInPicture
    ? 'pictureInPictureExit'
    : 'pictureInPicture'

  function handlePictureInPicture() {
    if (isPictureInPicture) {
      document.exitPictureInPicture()
    } else {
      videoElement.requestPictureInPicture()
    }
  }

  videoElement.onenterpictureinpicture = function () {
    setIsPictureInPicture(true)
  }
  videoElement.onleavepictureinpicture = function () {
    setIsPictureInPicture(false)
  }

  return (
    <MediaIconButton
      onClick={handlePictureInPicture}
      action={action}
      color={props.color}
    />
  )
}

export function FullscreenToggle(props: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement)

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setIsFullscreen(!isFullscreen)
    })
  }, [isFullscreen])

  const action = isFullscreen ? 'fullscreenExit' : 'fullscreen'

  function handleFullscreen() {
    if (isFullscreen) {
      document.exitFullscreen()
    } else {
      props.element.requestFullscreen()
    }
  }

  return (
    <MediaIconButton
      onClick={handleFullscreen}
      action={action}
      color={props.color}
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
      <Typography variant="body1" sx={{ color: props.color }}>
        {playbackRate}X
      </Typography>
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

  return (
    <MediaIconButton onClick={onClick} action={action} color={props.color} />
  )
}
