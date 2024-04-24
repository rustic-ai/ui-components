import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import Icon from '../../icon'

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
}

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

  const dataCyPrefix = controls[props.action].label.replaceAll(' ', '-')

  return (
    <Tooltip
      title={controls[props.action].label}
      PopperProps={{ container: document.fullscreenElement ?? document.body }}
    >
      <IconButton
        onClick={props.onClick}
        className={props.className}
        data-cy={`${dataCyPrefix}-button`}
        color="primary"
      >
        <Icon name={controls[props.action].symbol} />
      </IconButton>
    </Tooltip>
  )
}
