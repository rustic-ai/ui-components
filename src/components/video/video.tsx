import './video.css'

import { useMediaQuery, useTheme } from '@mui/material'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Drawer from '@mui/material/Drawer'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'

import {
  CaptionsToggle,
  MoveTenSecondsButton,
  PausePlayToggle,
  PlaybackRateButton,
  ProgressSlider,
  TranscriptToggle,
  VolumeSettings,
} from '../media/controls/commonControls'
import { MediaIconButton } from '../media/controls/mediaIconButton'
import {
  FullscreenToggle,
  PictureInPictureToggle,
} from '../media/controls/videoControls'
import TimeIndicator from '../media/timeIndicator/timeIndicator'
import Transcript from '../media/transcript/transcript'
import type { VideoFormat } from '../types'

export default function Video(props: VideoFormat) {
  const [isTranscriptShown, setIsTranscriptShown] = useState(false)
  const [areCaptionsShown, setAreCaptionsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement)

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
      setIsFullscreen(!isFullscreen)
    })
  }, [isFullscreen])

  function renderVideoElement() {
    return (
      <video
        className="rustic-video-element"
        data-cy="video-element"
        ref={videoRef}
        src={props.src}
      >
        {areCaptionsShown && (
          <track src={props.captions} kind="captions" default />
        )}
      </video>
    )
  }

  function renderTitle() {
    function exitFullscreen() {
      if (videoRef.current) {
        videoRef.current.pause()
        document.exitFullscreen()
      }
    }

    if (videoRef.current && videoContainerRef.current) {
      return (
        <Box className="rustic-video-title">
          <Typography
            variant="body2"
            data-cy="video-title"
            color="common.white"
          >
            {props.title}
          </Typography>
          {isFullscreen && isMobile && (
            <Box>
              <PictureInPictureToggle
                mediaElement={videoRef.current}
                color="common.white"
              />
              <MediaIconButton
                action="fullscreenExit"
                onClick={exitFullscreen}
                color="common.white"
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

  function renderTranscriptToggle(color: string = 'common.white') {
    if (props.transcript) {
      return (
        <TranscriptToggle
          active={isTranscriptShown}
          setActive={() => setIsTranscriptShown(!isTranscriptShown)}
          color={color}
        />
      )
    }
  }

  function renderMobileView() {
    function handlePlayFromMobile() {
      if (
        videoRef.current &&
        videoContainerRef.current &&
        isMobile &&
        !isFullscreen
      ) {
        if (videoRef.current.paused || videoRef.current.ended) {
          videoContainerRef.current.requestFullscreen()
          videoRef.current.play()
        } else {
          videoRef.current.pause()
        }
      }
    }

    if (!isFullscreen) {
      return (
        <>
          {videoRef.current && videoContainerRef.current && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              <MediaIconButton action="play" onClick={handlePlayFromMobile} />
              {renderTranscriptToggle('primary.main')}
            </Box>
          )}
        </>
      )
    }
    return (
      <>
        {videoRef.current && videoContainerRef.current && (
          <Box className="rustic-video-controls">
            <Drawer
              anchor="bottom"
              open={isTranscriptShown}
              onClose={() => setIsTranscriptShown(false)}
            >
              {renderTranscript()}
            </Drawer>

            <Box className="rustic-video-top-controls">
              <PausePlayToggle
                mediaElement={videoRef.current}
                color="common.white"
              />
              <ProgressSlider mediaElement={videoRef.current} />
              <TimeIndicator
                elapsedTimeInSeconds={elapsedTime}
                durationTimeInSeconds={videoRef.current.duration}
                color="common.white"
              />
            </Box>

            <Box className="rustic-video-bottom-controls">
              <Box className="rustic-time-controls">
                <MoveTenSecondsButton
                  mediaElement={videoRef.current}
                  movement="replay"
                  color="common.white"
                />
                <MoveTenSecondsButton
                  mediaElement={videoRef.current}
                  movement="forward"
                  color="common.white"
                />
                {props.captions && (
                  <CaptionsToggle
                    active={areCaptionsShown}
                    setActive={() => setAreCaptionsShown(!areCaptionsShown)}
                    color="common.white"
                  />
                )}
                <PlaybackRateButton
                  mediaElement={videoRef.current}
                  color="common.white"
                />
              </Box>

              <Box>{renderTranscriptToggle('common.white')}</Box>
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
          <Box className="rustic-video-controls">
            <ProgressSlider mediaElement={videoRef.current} />

            <Box className="rustic-video-bottom-controls">
              <Box className="rustic-video-bottom-controls-left">
                <PausePlayToggle
                  mediaElement={videoRef.current}
                  color="common.white"
                />
                <MoveTenSecondsButton
                  mediaElement={videoRef.current}
                  movement="replay"
                  color="common.white"
                />
                <MoveTenSecondsButton
                  mediaElement={videoRef.current}
                  movement="forward"
                  color="common.white"
                />
                {props.captions && (
                  <CaptionsToggle
                    active={areCaptionsShown}
                    setActive={() => setAreCaptionsShown(!areCaptionsShown)}
                    color="common.white"
                  />
                )}
                <PlaybackRateButton
                  mediaElement={videoRef.current}
                  color="common.white"
                />

                <VolumeSettings
                  mediaElement={videoRef.current}
                  color="common.white"
                />

                <TimeIndicator
                  elapsedTimeInSeconds={elapsedTime}
                  durationTimeInSeconds={videoRef.current.duration}
                  color="common.white"
                  style="condensed"
                />
              </Box>

              <Box className="rustic-video-bottom-controls-right">
                {renderTranscriptToggle()}
                <PictureInPictureToggle
                  mediaElement={videoRef.current}
                  color="common.white"
                />

                <FullscreenToggle
                  element={videoContainerRef.current}
                  color="common.white"
                />
              </Box>
            </Box>
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
        {(!isMobile || isFullscreen) && renderTitle()}
        {renderVideoElement()}
        {renderControls()}
      </Box>
      {!isFullscreen && renderTranscript()}
    </Box>
  )
}
