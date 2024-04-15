import React, { useState } from 'react'

import type { MediaControls } from './commonControls'
import { MediaIconButton } from './mediaIconButton'

interface FullscreenButtonProps {
  element: HTMLElement
  onError: (errorMessage: string) => void
}

interface PictureInPictureButtonProps extends MediaControls {
  onError: (errorMessage: string) => void
}

export function PictureInPictureButton(props: PictureInPictureButtonProps) {
  const [isPictureInPicture, setIsPictureInPicture] = useState(
    !!document.pictureInPictureElement
  )

  const videoElement = props.mediaElement as HTMLVideoElement

  const action = isPictureInPicture
    ? 'pictureInPictureExit'
    : 'pictureInPicture'

  function handlePictureInPicture() {
    if (isPictureInPicture) {
      document
        .exitPictureInPicture()
        .then(() => {
          setIsPictureInPicture(false)
        })
        .catch((error: DOMException) => {
          props.onError(
            `Failed to exit picture-in-picture mode. Error: ${error.message}`
          )
        })
    } else {
      videoElement
        .requestPictureInPicture()
        .then(() => {
          setIsPictureInPicture(true)
        })
        .catch((error: DOMException) => {
          props.onError(
            `Failed to enter picture-in-picture mode. Error: ${error.message}`
          )
        })
    }
  }

  // State is updated by event listeners so that the icon is displayed correctly, even when users exit picture-in-picture without direct use of this toggle (e.g. exiting from the picture-in-picture window).
  videoElement.onleavepictureinpicture = function () {
    setIsPictureInPicture(false)
  }

  return <MediaIconButton onClick={handlePictureInPicture} action={action} />
}

export function FullscreenButton(props: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement)

  const action = isFullscreen ? 'fullscreenExit' : 'fullscreen'

  function handleFullscreen() {
    if (isFullscreen) {
      document
        .exitFullscreen()
        .then(() => {
          setIsFullscreen(false)
        })
        .catch((error: TypeError) => {
          props.onError(
            `Failed to exit fullscreen mode. Error: ${error.message}`
          )
        })
    } else {
      props.element
        .requestFullscreen()
        .then(() => {
          setIsFullscreen(true)
        })
        .catch((error: TypeError) => {
          props.onError(
            `Failed to enter fullscreen mode. Error: ${error.message}`
          )
        })
    }
  }

  return <MediaIconButton onClick={handleFullscreen} action={action} />
}
