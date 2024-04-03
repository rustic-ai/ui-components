/* eslint-disable no-magic-numbers */
import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded'
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded'
import IconButton from '@mui/material/IconButton'
import React from 'react'

interface MoveTenSecondsButtonProps {
  mediaElement: HTMLMediaElement
  movement: 'replay' | 'forward'
  isMobile: boolean
}

export default function MoveTenSecondsButton(props: MoveTenSecondsButtonProps) {
  const isReplayMovement = props.movement === 'replay'

  function handleForwardTenSeconds() {
    props.mediaElement.currentTime += 10
  }

  function handleReplayTenSeconds() {
    props.mediaElement.currentTime -= 10
  }

  return (
    <IconButton
      onClick={
        isReplayMovement ? handleReplayTenSeconds : handleForwardTenSeconds
      }
      aria-label={`${isReplayMovement ? 'replay' : 'forward'} ten seconds`}
    >
      {isReplayMovement ? (
        <Replay10RoundedIcon
          data-cy="replay-button"
          color="primary"
          fontSize={props.isMobile ? 'large' : 'medium'}
        />
      ) : (
        <Forward10RoundedIcon
          data-cy="forward-button"
          color="primary"
          fontSize={props.isMobile ? 'large' : 'medium'}
        />
      )}
    </IconButton>
  )
}
