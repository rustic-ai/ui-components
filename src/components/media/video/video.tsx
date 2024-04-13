/* eslint-disable no-magic-numbers */
import './video.css'

import { useMediaQuery, useTheme } from '@mui/material'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'

import type { VideoFormat } from '../../types'
import {
  MoveTenSecondsButton,
  PlaybackRateButton,
  PlayOrPauseButton,
  ProgressSlider,
  ToggleTranscriptButton,
  VolumeSettings,
} from '../controls/commonControls'
import { MediaIconButton } from '../controls/mediaIconButton'
import {
  FullscreenButton,
  PictureInPictureButton,
} from '../controls/videoControls'
import TimeIndicator from '../timeIndicator/timeIndicator'
import Transcript from '../transcript/transcript'

export default function Video(props: VideoFormat) {
  const [isTranscriptShown, setIsTranscriptShown] = useState(false)
  const [areCaptionsShown, setAreCaptionsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement)

  const [controlErrorMessage, setControlErrorMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [elapsedTime, setElapsedTime] = useState(0)

  const videoContainerRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const loadingErrorMessage = 'The video resource has failed to load'
    const stalledErrorMessage = 'Failed to fetch data, but trying'

    function updateElapsedTime() {
      if (videoRef.current) {
        setElapsedTime(videoRef.current.currentTime)
      }
    }
    function handleCanPlay() {
      setErrorMessage('')
      setIsLoading(false)
    }
    function handleError(errorMessage: string) {
      setErrorMessage(errorMessage)
      setIsLoading(false)
    }

    videoRef.current?.addEventListener('timeupdate', updateElapsedTime)
    videoRef.current?.addEventListener('canplay', handleCanPlay)
    videoRef.current?.addEventListener('error', () =>
      handleError(loadingErrorMessage)
    )
    videoRef.current?.addEventListener('stalled', () =>
      handleError(stalledErrorMessage)
    )
    document.addEventListener('fullscreenchange', () => {
      setIsFullscreen(!!document.fullscreenElement)
    })
  }, [])

  function adjustHexColorOpacity(color: string, opacity: number) {
    const r = parseInt(color.slice(1, 3), 16)
    const g = parseInt(color.slice(3, 5), 16)
    const b = parseInt(color.slice(5, 7), 16)

    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }

  const backgroundColor = adjustHexColorOpacity(
    theme.palette.background.paper,
    0.6
  )

  function renderVideoElement() {
    return (
      <video
        className="rustic-video-element"
        data-cy="video-element"
        ref={videoRef}
        src={props.src}
        poster={props.poster}
      >
        {areCaptionsShown && (
          <track src={props.captions} kind="captions" default />
        )}
      </video>
    )
  }

  function renderTitle() {
    if (videoRef.current && videoContainerRef.current) {
      return (
        <Box
          className="rustic-video-title"
          sx={{
            backgroundColor: backgroundColor,
          }}
        >
          <Typography variant="body2" data-cy="video-title">
            {props.title}
          </Typography>
          {isFullscreen && isMobile && (
            <Box>
              <PictureInPictureButton
                mediaElement={videoRef.current}
                onError={setControlErrorMessage}
              />
              <FullscreenButton
                element={videoContainerRef.current}
                onError={setControlErrorMessage}
              />
            </Box>
          )}
        </Box>
      )
    }
  }

  function renderTranscript() {
    if (props.transcript && isTranscriptShown) {
      return <Transcript transcript={props.transcript} />
    }
  }

  function renderCaptionsButton() {
    if (props.captions && props.captions.length > 0) {
      const action = areCaptionsShown ? 'captionsOff' : 'captionsOn'

      return (
        <MediaIconButton
          action={action}
          onClick={() => setAreCaptionsShown(!areCaptionsShown)}
        />
      )
    }
  }

  function renderTranscriptToggle() {
    if (props.transcript) {
      return (
        <ToggleTranscriptButton
          isTranscriptShown={isTranscriptShown}
          setIsTranscriptShown={() => setIsTranscriptShown(!isTranscriptShown)}
        />
      )
    }
  }

  function renderMobileView() {
    if (isFullscreen) {
      return (
        <>
          {videoRef.current && videoContainerRef.current && (
            <Box
              className="rustic-video-controls"
              data-cy="controls"
              sx={{
                backgroundColor: backgroundColor,
              }}
            >
              <Box className="rustic-video-top-controls">
                <PlayOrPauseButton
                  mediaElement={videoRef.current}
                  onError={setControlErrorMessage}
                />
                <ProgressSlider mediaElement={videoRef.current} />
                <TimeIndicator
                  elapsedTimeInSeconds={elapsedTime}
                  durationTimeInSeconds={videoRef.current.duration}
                />
              </Box>

              <Box className="rustic-video-bottom-controls">
                <Box className="rustic-time-controls">
                  <MoveTenSecondsButton
                    mediaElement={videoRef.current}
                    movement="replay"
                  />
                  <MoveTenSecondsButton
                    mediaElement={videoRef.current}
                    movement="forward"
                  />
                  {renderCaptionsButton()}
                  <PlaybackRateButton mediaElement={videoRef.current} />
                </Box>

                {renderTranscriptToggle()}
              </Box>
              {renderTranscript()}
            </Box>
          )}
        </>
      )
    }
    return (
      <>
        {videoRef.current && videoContainerRef.current && (
          <Box className="rustic-video-controls-mobile-preview">
            <PlayOrPauseButton
              mediaElement={videoRef.current}
              onError={setControlErrorMessage}
            />
            <Box className="rustic-video-controls-right">
              {renderTranscriptToggle()}
              <FullscreenButton
                element={videoContainerRef.current}
                onError={setControlErrorMessage}
              />
            </Box>
          </Box>
        )}
      </>
    )
  }

  function renderDesktopView() {
    return (
      <>
        {videoRef.current && videoContainerRef.current && (
          <Box
            className="rustic-video-controls"
            data-cy="controls"
            sx={{
              backgroundColor: backgroundColor,
            }}
          >
            <ProgressSlider mediaElement={videoRef.current} />

            <Box className="rustic-video-bottom-controls">
              <Box className="rustic-video-bottom-controls-left">
                <PlayOrPauseButton
                  mediaElement={videoRef.current}
                  onError={setControlErrorMessage}
                />
                <MoveTenSecondsButton
                  mediaElement={videoRef.current}
                  movement="replay"
                />
                <MoveTenSecondsButton
                  mediaElement={videoRef.current}
                  movement="forward"
                />
                {renderCaptionsButton()}
                <PlaybackRateButton mediaElement={videoRef.current} />

                <VolumeSettings mediaElement={videoRef.current} />

                <TimeIndicator
                  elapsedTimeInSeconds={elapsedTime}
                  durationTimeInSeconds={videoRef.current.duration}
                  style="condensed"
                />
              </Box>

              <Box className="rustic-video-bottom-controls-right">
                {renderTranscriptToggle()}
                <PictureInPictureButton
                  mediaElement={videoRef.current}
                  onError={setControlErrorMessage}
                />
                <FullscreenButton
                  element={videoContainerRef.current}
                  onError={setControlErrorMessage}
                />
              </Box>
            </Box>
            {isFullscreen && renderTranscript()}
          </Box>
        )}
      </>
    )
  }

  const renderControls = isMobile ? renderMobileView : renderDesktopView

  if (errorMessage.length > 0) {
    return (
      <Alert severity="error" data-cy="error">
        {errorMessage}
      </Alert>
    )
  }

  return (
    <Box className="rustic-video" data-cy="video">
      {isLoading && (
        <CircularProgress
          data-cy="spinner"
          className="rustic-video-loading-spinner"
        />
      )}

      <Box
        ref={videoContainerRef}
        className="rustic-video-screen"
        sx={{ visibility: isLoading ? 'hidden' : 'visible' }}
      >
        <Fade in={controlErrorMessage.length > 0}>
          <Alert
            severity="error"
            className="rustic-video-control-error-message"
          >
            {controlErrorMessage}
          </Alert>
        </Fade>

        {(!isMobile || isFullscreen) && renderTitle()}
        {renderVideoElement()}
        {renderControls()}
      </Box>
      {!isFullscreen && renderTranscript()}
    </Box>
  )
}
