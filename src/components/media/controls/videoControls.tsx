import React, { useState } from 'react'

import type { MediaControls } from './commonControls'
import { MediaIconButton } from './mediaIconButton'

interface FullscreenToggleProps {
  element: HTMLElement
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

  // State is updated by event listeners so that the icon is displayed correctly, even when users enter/exit picture-in-picture without direct use of this toggle (e.g. exiting from the picture-in-picture window).
  videoElement.onenterpictureinpicture = function () {
    setIsPictureInPicture(true)
  }
  videoElement.onleavepictureinpicture = function () {
    setIsPictureInPicture(false)
  }

  return <MediaIconButton onClick={handlePictureInPicture} action={action} />
}

export function FullscreenToggle(props: FullscreenToggleProps) {
  const isFullscreen = !!document.fullscreenElement

  const action = isFullscreen ? 'fullscreenExit' : 'fullscreen'

  function handleFullscreen() {
    if (isFullscreen) {
      document.exitFullscreen()
    } else {
      props.element.requestFullscreen()
    }
  }

  return <MediaIconButton onClick={handleFullscreen} action={action} />
}
