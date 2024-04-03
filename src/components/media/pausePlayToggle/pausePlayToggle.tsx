/* eslint-disable no-magic-numbers */
import './pausePlayToggle.css'

import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import IconButton from '@mui/material/IconButton'
import React from 'react'

interface PausePlayButtonProps {
  mediaElement: HTMLMediaElement
  isPlaying: boolean
}

export default function PausePlayToggle(props: PausePlayButtonProps) {
  function handlePausePlayToggle() {
    if (props.mediaElement.paused || props.mediaElement.ended) {
      props.mediaElement.play()
    } else {
      props.mediaElement.pause()
    }
  }

  return (
    <IconButton
      onClick={handlePausePlayToggle}
      aria-label={props.isPlaying ? 'pause' : 'play'}
    >
      {props.isPlaying ? (
        <PauseCircleFilledIcon
          className="rustic-pause-play-icon"
          data-cy="pause-button"
          fontSize="medium"
          color="primary"
        />
      ) : (
        <PlayCircleFilledIcon
          className="rustic-pause-play-icon"
          data-cy="play-button"
          fontSize="medium"
          color="primary"
        />
      )}
    </IconButton>
  )
}
