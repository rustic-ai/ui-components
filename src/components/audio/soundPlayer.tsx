/* eslint-disable no-magic-numbers */
import './soundPlayer.css'

import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded'
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded'
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded'
import { useTheme } from '@mui/material'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CardMedia from '@mui/material/CardMedia'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Slider from '@mui/material/Slider'
import Typography from '@mui/material/Typography'
import { Box, Stack } from '@mui/system'
import React, { useEffect, useRef, useState } from 'react'

import { useIsMobile } from '../helper'
import PopoverMenu from '../menu/popoverMenu'

type BufferRange = {
  start: number
  end: number
}

export interface SoundPlayerProps {
  /** URL of the sound file to be played, either a local file path or a remote URL pointing to the sound file. */
  src: string
  /** Title of the sound to be played. */
  title?: string
  /** Transcript of the sound content. */
  transcript?: string
}

export default function SoundPlayer(props: SoundPlayerProps) {
  const [isTranscriptShown, setIsTranscriptShown] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bufferedRanges, setBufferedRanges] = useState<BufferRange[]>([])
  const [duration, setDuration] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [volumeFraction, setVolumeFraction] = useState<number>(1)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [errorMessage, setErrorMessage] = useState('')

  const theme = useTheme()
  const audioRef = useRef<HTMLAudioElement>(null)
  let audioElement = audioRef.current

  const isMobile = useIsMobile()

  function formatTime(durationInSeconds: number): string {
    const minutes = Math.floor(durationInSeconds / 60)
    const seconds = Math.floor(durationInSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const formattedCurrentTime = formatTime(elapsedTime)
  const formattedDuration = formatTime(duration)
  const formattedTimeDisplay = `${formattedCurrentTime} / ${formattedDuration}`
  const playbackRateOptions = [0.25, 0.5, 1, 1.5, 2]

  const playbackRateMenuItems = playbackRateOptions.map((rate) => {
    return {
      label: `${rate}x`,
      onClick: () => handlePlaybackRateChange(rate),
    }
  })

  useEffect(() => {
    audioElement = audioRef.current

    const loadingErrorMessage = 'The audio resource has failed to load'
    const stalledErrorMessage = 'Failed to fetch data, but trying'

    // wait for loadedmetadata to get content time duration
    function getDuration() {
      if (audioElement) {
        setDuration(audioElement.duration)
      }
    }
    // update time stamp as video plays
    function updateTime() {
      if (audioElement) {
        setElapsedTime(audioElement.currentTime)
      }
    }
    // update progress buffer bar
    function updateBufferedRanges() {
      if (audioElement) {
        const buffered = audioElement.buffered
        const ranges = []
        for (let i = 0; i < buffered.length; i++) {
          ranges.push({
            start: buffered.start(i),
            end: buffered.end(i),
          })
        }
        setBufferedRanges(ranges)
      }
    }
    function handleError(errorMessage: string) {
      setErrorMessage(errorMessage)
    }

    audioElement?.addEventListener('loadedmetadata', getDuration)
    audioElement?.addEventListener('timeupdate', updateTime)
    audioElement?.addEventListener('progress', updateBufferedRanges)
    audioElement?.addEventListener('canplay', () => setIsLoading(false))
    audioElement?.addEventListener('ended', () => setIsPlaying(false))
    audioElement?.addEventListener('error', () =>
      handleError(loadingErrorMessage)
    )
    audioElement?.addEventListener('stalled', () =>
      handleError(stalledErrorMessage)
    )

    return () => {
      audioElement?.removeEventListener('loadedmetadata', getDuration)
      audioElement?.removeEventListener('timeupdate', updateTime)
      audioElement?.removeEventListener('progress', updateBufferedRanges)
      audioElement?.removeEventListener('canplay', () => setIsLoading(false))
      audioElement?.removeEventListener('ended', () => setIsPlaying(false))
      audioElement?.removeEventListener('error', () =>
        handleError(loadingErrorMessage)
      )
      audioElement?.removeEventListener('stalled', () =>
        handleError(stalledErrorMessage)
      )
    }
  }, [])

  function handleMuteToggle() {
    if (audioElement) {
      if (audioElement.muted) {
        audioElement.muted = false
        setVolumeFraction(1)
      } else {
        audioElement.muted = true
        setVolumeFraction(0)
      }
    }
  }

  function handleForwardTenSeconds() {
    if (audioElement) {
      audioElement.currentTime += 10
    }
  }

  function handleReplayTenSeconds() {
    if (audioElement) {
      audioElement.currentTime -= 10
    }
  }

  function handleTimeChange(event: Event, newValue: number | number[]) {
    if (audioElement) {
      audioElement.currentTime = newValue as number
    }
  }

  function handlePausePlayToggle() {
    if (audioElement?.paused || audioElement?.ended) {
      audioElement?.play()
      setIsPlaying(true)
    } else {
      audioElement?.pause()
      setIsPlaying(false)
    }
  }

  function handlePlaybackRateChange(rate: number) {
    if (audioElement) {
      audioElement.playbackRate = rate
      setPlaybackRate(rate)
    }
  }

  function handleVolumeChange(
    event: Event | React.MouseEvent,
    newValue: number | number[]
  ) {
    if (audioElement) {
      audioElement.volume = newValue as number
      setVolumeFraction(newValue as number)
    }
  }

  function renderVolumeSlider() {
    return (
      <Stack className="rustic-volume-container">
        <IconButton onClick={handleMuteToggle}>
          {volumeFraction === 0 ? (
            <VolumeOffRoundedIcon color="primary" />
          ) : (
            <VolumeUpRoundedIcon color="primary" />
          )}
        </IconButton>
        <Slider
          className="rustic-volume-slider"
          data-cy="volume-slider"
          size="small"
          aria-label="Volume"
          aria-valuetext={`Volume: ${volumeFraction * 100}%`}
          max={1}
          step={0.1}
          value={volumeFraction}
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
      </Stack>
    )
  }

  function renderTitle() {
    return (
      <Typography
        variant="h6"
        className="rustic-sound-player-title"
        data-cy="sound-player-title"
      >
        {props.title}
      </Typography>
    )
  }

  function renderBufferedProgressBar() {
    return bufferedRanges.map((range, index) => (
      <Box
        key={index}
        className="rustic-progress-buffered"
        sx={{
          backgroundColor: 'primary.light',
          width: `${((range.end - range.start) / duration) * 100}%`,
        }}
      />
    ))
  }

  function renderPlaybackRateIcon() {
    return <Typography color="primary.main">{playbackRate}X</Typography>
  }

  if (errorMessage.length > 0) {
    return (
      <Alert severity="error" data-cy="error">
        {errorMessage}
      </Alert>
    )
  }

  return (
    <Box className="rustic-sound-player" data-cy="audio">
      <CardMedia
        className="rustic-sound-player-element"
        data-cy="audio-element"
        ref={audioRef}
        src={props.src}
        component="audio"
      />

      {isLoading ? (
        <CircularProgress data-cy="spinner" />
      ) : (
        <>
          {!isMobile && renderTitle()}

          <Box className="rustic-sound-player-controls">
            {isMobile && (
              <Box className="rustic-time-container">
                <Typography variant="overline" color="text.secondary">
                  {formattedCurrentTime}
                </Typography>
                <Typography variant="overline" color="text.secondary">
                  {formattedDuration}
                </Typography>
              </Box>
            )}

            <Box className="rustic-progress">
              <Slider
                className="rustic-progress-slider"
                data-cy="progress-slider"
                size="small"
                aria-label="Time"
                aria-valuetext={`Current time: ${formattedCurrentTime}`}
                max={duration}
                value={elapsedTime}
                onChange={handleTimeChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatTime(value)}
                sx={{
                  '& .MuiSlider-rail': {
                    backgroundColor: 'action.disabled',
                  },
                }}
              />
              {renderBufferedProgressBar()}
            </Box>

            {isMobile && renderTitle()}

            <Box className="rustic-sound-player-bottom-controls">
              <Box className="rustic-sound-player-bottom-controls-left">
                <Box className="rustic-time-controls">
                  <IconButton
                    onClick={handleReplayTenSeconds}
                    aria-label="replay ten seconds"
                  >
                    <Replay10RoundedIcon
                      data-cy="replay-button"
                      color="primary"
                      fontSize={isMobile ? 'large' : 'medium'}
                    />
                  </IconButton>
                  <IconButton
                    onClick={handlePausePlayToggle}
                    aria-label={isPlaying ? 'pause' : 'play'}
                  >
                    {isPlaying ? (
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
                  <IconButton
                    onClick={handleForwardTenSeconds}
                    aria-label="fast forward ten seconds"
                  >
                    <Forward10RoundedIcon
                      data-cy="forward-button"
                      color="primary"
                      fontSize={isMobile ? 'large' : 'medium'}
                    />
                  </IconButton>
                </Box>

                {!isMobile && (
                  <Typography variant="overline" color="text.secondary">
                    {formattedTimeDisplay}
                  </Typography>
                )}
              </Box>

              {isMobile && renderVolumeSlider()}

              <Box className="rustic-sound-player-bottom-controls-right">
                {props.transcript && (
                  <Button
                    className="rustic-transcript-toggle"
                    data-cy="transcript-toggle"
                    size="small"
                    onClick={() => setIsTranscriptShown(!isTranscriptShown)}
                    endIcon={
                      isTranscriptShown ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )
                    }
                  >
                    <Typography variant="overline">
                      {isTranscriptShown ? 'Hide' : 'Show'} Transcript
                    </Typography>
                  </Button>
                )}
                {!isMobile && renderVolumeSlider()}
                <PopoverMenu
                  menuItems={playbackRateMenuItems}
                  ariaLabel={`Playback speed: ${playbackRate}x`}
                  icon={renderPlaybackRateIcon()}
                />
              </Box>
            </Box>

            {isTranscriptShown && (
              <>
                <Typography
                  className="rustic-transcript-header"
                  variant="overline"
                  color="text.secondary"
                  sx={{ borderLeft: `4px solid ${theme.palette.divider}` }}
                >
                  Transcript
                </Typography>
                <Typography
                  className="rustic-transcript"
                  data-cy="transcript"
                  variant="body2"
                >
                  {props.transcript}
                </Typography>
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  )
}
