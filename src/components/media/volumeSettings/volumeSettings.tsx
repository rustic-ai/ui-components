import './volumeSettings.css'

import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import React from 'react'

interface VolumeSettingsProps {
  mediaElement: HTMLMediaElement
  volumeFraction: number
}

export default function VolumeSettings(props: VolumeSettingsProps) {
  function handleMuteToggle() {
    if (props.mediaElement.muted && props.mediaElement.volume === 0) {
      // If audio was muted and volume was 0, unmute and restore to full volume
      props.mediaElement.muted = false
      props.mediaElement.volume = 1
    } else if (props.mediaElement.muted) {
      // If audio was muted, unmute and restore previous volume
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
    if (newValue === 0) {
      props.mediaElement.muted = true
    } else {
      props.mediaElement.muted = false
    }

    props.mediaElement.volume = newValue as number
  }

  return (
    <Box className="rustic-volume-settings">
      <IconButton
        onClick={handleMuteToggle}
        className="rustic-mute-button"
        data-cy="mute-button"
        aria-label={props.mediaElement.muted ? 'Unmute' : 'Mute'}
      >
        {props.volumeFraction === 0 ? (
          <VolumeOffRoundedIcon color="primary" />
        ) : (
          <VolumeUpRoundedIcon color="primary" />
        )}
      </IconButton>
      <Slider
        className="rustic-volume-slider"
        data-cy="volume-slider"
        size="small"
        max={1}
        step={0.1}
        aria-label="Volume"
        // eslint-disable-next-line no-magic-numbers
        aria-valuetext={`Volume: ${props.volumeFraction * 100}%`}
        value={props.volumeFraction}
        onChange={handleVolumeChange}
        sx={{
          '& .MuiSlider-rail': {
            backgroundColor: 'action.disabled',
          },
          '& .MuiSlider-track': {
            backgroundColor: 'primary.light',
            borderColor: 'primary.light',
          },
        }}
      />
    </Box>
  )
}
