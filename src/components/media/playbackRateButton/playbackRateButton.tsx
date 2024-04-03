/* eslint-disable no-magic-numbers */
import './playbackRateButton.css'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React from 'react'

interface PlaybackRateButtonProps {
  mediaElement: HTMLMediaElement
  playbackRate: number
}

export default function PlaybackRateButton(props: PlaybackRateButtonProps) {
  function handlePlaybackRateChange() {
    let newPlaybackRate
    // Increase playback speed by 0.5 until until 2 is reached, then reset to 1
    if (props.mediaElement.playbackRate === 2) {
      newPlaybackRate = 1
    } else {
      newPlaybackRate = props.mediaElement.playbackRate + 0.5
    }

    props.mediaElement.playbackRate = newPlaybackRate
  }

  return (
    <Button
      onClick={handlePlaybackRateChange}
      className="rustic-playback-rate-button"
      aria-label={`Playback rate: ${props.playbackRate}x, click to change`}
      data-cy="playback-rate-button"
    >
      <Typography variant="body1" color="primary.main">
        {props.playbackRate}X
      </Typography>
    </Button>
  )
}
