import React, { useEffect, useState } from 'react'

import type { MediaControls } from './commonControls'
import { MediaIconButton } from './mediaIconButton'

interface FullscreenToggleProps {
  element: HTMLElement
  color?: string
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
