/* eslint-disable no-magic-numbers */
import './sound.css'

import ClosedCaptionDisabledRoundedIcon from '@mui/icons-material/ClosedCaptionDisabledRounded'
import ClosedCaptionRoundedIcon from '@mui/icons-material/ClosedCaptionRounded'
import { useMediaQuery, useTheme } from '@mui/material'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { Box } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'

import type { AudioFormat } from '../../types'
import {
  MoveTenSecondsButton,
  PausePlayToggle,
  PlaybackRateButton,
  ProgressSlider,
  TranscriptToggle,
  VolumeSettings,
} from '../controls/controls'
import TimeIndicator from '../timeIndicator/timeIndicator'
import Transcript from '../transcript/transcript'

export default function Sound(props: AudioFormat) {
  const [isTranscriptShown, setIsTranscriptShown] = useState(false)
  const [areCaptionsShown, setAreCaptionsShown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [errorMessage, setErrorMessage] = useState('')

  const theme = useTheme()
  const audioRef = useRef<HTMLVideoElement>(null)
  let audioElement = audioRef.current

  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    audioElement = audioRef.current

    const loadingErrorMessage = 'The audio resource has failed to load'
    const stalledErrorMessage = 'Failed to fetch data, but trying'

    // update time stamp as video plays
    function updateTime() {
      if (audioElement) {
        setElapsedTime(audioElement.currentTime)
      }
    }
    function handleCanPlay() {
      setErrorMessage('')
      setIsLoading(false)
    }
    function handleError(errorMessage: string) {
      setErrorMessage(errorMessage)
    }

    audioElement?.addEventListener('timeupdate', updateTime)
    audioElement?.addEventListener('canplay', handleCanPlay)
    audioElement?.addEventListener('error', () =>
      handleError(loadingErrorMessage)
    )
    audioElement?.addEventListener('stalled', () =>
      handleError(stalledErrorMessage)
    )

    return () => {
      audioElement?.removeEventListener('timeupdate', updateTime)
      audioElement?.removeEventListener('canplay', handleCanPlay)
      audioElement?.removeEventListener('error', () =>
        handleError(loadingErrorMessage)
      )
      audioElement?.removeEventListener('stalled', () =>
        handleError(stalledErrorMessage)
      )
    }
  }, [])

  function renderSources() {
    const invalidSrcErrorMessage = 'No valid audio sources were found'
    const validSrcList = props.src.filter((src) => src.length > 0)

    // Check if there are no valid sources
    if (validSrcList.length === 0) {
      setErrorMessage(invalidSrcErrorMessage)
    } else {
      return validSrcList.map((src, index) => <source key={index} src={src} />)
    }
  }

  function renderTracks() {
    if (props.captions && props.captions.length > 0) {
      return props.captions.map((captionSrc, index) => (
        <track key={index} src={captionSrc} kind="captions" default />
      ))
    }
  }

  if (errorMessage.length > 0) {
    return (
      <Alert severity="error" data-cy="error">
        {errorMessage}
      </Alert>
    )
  }

  function renderTitle() {
    return (
      <Typography
        variant="h6"
        className="rustic-sound-title"
        data-cy="sound-player-title"
      >
        {props.title}
      </Typography>
    )
  }

  function renderCaptionsToggle() {
    if (props.captions && props.captions.length > 0) {
      return (
        <IconButton
          onClick={() => setAreCaptionsShown(!areCaptionsShown)}
          aria-label={areCaptionsShown ? 'Hide captions' : 'Show captions'}
          data-cy="captions-toggle"
        >
          {areCaptionsShown ? (
            <ClosedCaptionRoundedIcon color="primary" />
          ) : (
            <ClosedCaptionDisabledRoundedIcon color="primary" />
          )}
        </IconButton>
      )
    }
  }

  return (
    <Box className="rustic-sound" data-cy="audio">
      <video
        data-cy="audio-element"
        ref={audioRef}
        className={areCaptionsShown ? 'rustic-has-captions' : ''}
      >
        {renderSources()}
        {areCaptionsShown && renderTracks()}
      </video>

      {isLoading || !audioElement ? (
        <CircularProgress data-cy="spinner" />
      ) : (
        <>
          {!isMobile && renderTitle()}

          <Box className="rustic-sound-controls">
            {isMobile && (
              <TimeIndicator
                elapsedTimeInSeconds={elapsedTime}
                durationTimeInSeconds={audioElement.duration}
                style="wide"
              />
            )}

            <ProgressSlider mediaElement={audioElement} />

            {isMobile && renderTitle()}

            <Box className="rustic-sound-bottom-controls">
              <Box className="rustic-sound-bottom-controls-left">
                <Box className="rustic-time-controls">
                  <MoveTenSecondsButton
                    mediaElement={audioElement}
                    movement="replay"
                    isMobile={isMobile}
                  />
                  <PausePlayToggle mediaElement={audioElement} />
                  <MoveTenSecondsButton
                    mediaElement={audioElement}
                    movement="forward"
                    isMobile={isMobile}
                  />
                </Box>

                {!isMobile && renderCaptionsToggle()}

                {!isMobile && (
                  <PlaybackRateButton mediaElement={audioElement} />
                )}

                {!isMobile && <VolumeSettings mediaElement={audioElement} />}

                {!isMobile && (
                  <TimeIndicator
                    elapsedTimeInSeconds={elapsedTime}
                    durationTimeInSeconds={audioElement.duration}
                    style="condensed"
                  />
                )}
              </Box>

              {isMobile && <VolumeSettings mediaElement={audioElement} />}

              <Box className="rustic-sound-bottom-controls-right">
                {props.transcript && (
                  <TranscriptToggle
                    isTranscriptShown={isTranscriptShown}
                    setIsTranscriptShown={() =>
                      setIsTranscriptShown(!isTranscriptShown)
                    }
                  />
                )}

                <Box>
                  {isMobile && renderCaptionsToggle()}
                  {isMobile && (
                    <PlaybackRateButton mediaElement={audioElement} />
                  )}
                </Box>
              </Box>
            </Box>

            {props.transcript && isTranscriptShown && (
              <Transcript transcript={props.transcript} />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}
