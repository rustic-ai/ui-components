import './textInput.css'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useRef, useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import Icon from '../icon'
import type { Message, TextInputProps } from '../types'

export default function TextInput(props: TextInputProps) {
  const [messageText, setMessageText] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isRecording, setIsRecording] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isEndingRecording, setIsEndingRecording] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const isEmptyMessage = !messageText.trim().length
  const speechToTextTooltipTitle = `${isRecording ? 'Stop' : 'Start'} speech to text`
  const speechToTextInactiveColor = isFocused ? 'primary.main' : 'primary.light'
  const speechToTextIconColor = isRecording
    ? 'error.main'
    : speechToTextInactiveColor
  const speechToTextIconName = isRecording ? 'stop_circle' : 'speech_to_text'

  const speechRecognitionErrors = {
    'no-speech':
      'No speech detected. Check your microphone volume and try again.',
    aborted:
      'Speech input was aborted. Ensure no other windows are accessing your microphone and try again.',
    'audio-capture':
      'Could not capture any audio. Check that your microphone is connected and try again.',
    network:
      'Failed to connect to the internet for recognition. Check your internet connection and try again.',
    'not-allowed':
      'This functionality requires microphone access. Please allow microphone access and try again.',
    'service-not-allowed':
      "Speech recognition service is not allowed, either because the browser doesn't support it or because of reasons of security, privacy or user preference.",
    'bad-grammar':
      'There was an error in the speech recognition grammar or format. Check your speech input or grammar rules.',
    'language-not-supported':
      "The language you're speaking isn't supported. Try speaking in a different language or check your device settings.",
  }

  const speechToTextButtonAdornment = {
    endAdornment: (
      <InputAdornment position="end">
        {isEndingRecording ? (
          <CircularProgress size={24} data-cy="spinner" />
        ) : (
          <Tooltip title={speechToTextTooltipTitle}>
            <IconButton
              data-cy="record-button"
              onClick={handleToggleSpeechToText}
              size="small"
              sx={{ color: speechToTextIconColor }}
            >
              <Icon name={speechToTextIconName} />
            </IconButton>
          </Tooltip>
        )}
      </InputAdornment>
    ),
  }

  function handleToggleSpeechToText() {
    const microphone = new window.webkitSpeechRecognition()
    const recognitionLang = navigator.language

    microphone.lang = recognitionLang

    if (isRecording) {
      microphone.stop()
      setIsEndingRecording(true)
      setIsRecording(false)
    } else {
      microphone.start()
      setErrorMessage('')
      setIsRecording(true)
    }

    microphone.onstart = () => {
      setIsRecording(true)
    }

    microphone.onresult = (event: SpeechRecognitionEvent) => {
      const currentTranscript = event.results[0][0].transcript

      if (messageText.length > 0) {
        setMessageText(messageText + ' ' + currentTranscript)
      } else {
        setMessageText(currentTranscript)
      }

      inputRef.current?.focus()
      setIsRecording(false)
    }

    microphone.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorDescription = speechRecognitionErrors[event.error]

      setErrorMessage(errorDescription)
      setIsRecording(false)
    }

    microphone.onend = () => {
      setIsEndingRecording(false)
      setIsRecording(false)
    }
  }

  function handleSendMessage(): void {
    if (!isEmptyMessage) {
      const currentTime = new Date().toISOString()

      const formattedMessage: Message = {
        id: getUUID(),
        timestamp: currentTime,
        sender: props.sender,
        conversationId: props.conversationId,
        format: 'text',
        data: { text: messageText },
      }

      props.ws.send(formattedMessage)
      setMessageText('')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setErrorMessage('')
    setMessageText(e.target.value)
  }

  return (
    <Box className="rustic-text-input-container">
      <Box className="rustic-text-input-and-error-container">
        {errorMessage.length > 0 && (
          <Typography
            variant="caption"
            color="error"
            className="rustic-error-message"
          >
            {errorMessage}
          </Typography>
        )}
        <TextField
          data-cy="text-input"
          className="rustic-text-input"
          variant="outlined"
          value={messageText}
          label={props.label}
          placeholder={props.placeholder}
          maxRows={props.maxRows}
          multiline={props.multiline}
          fullWidth={props.fullWidth}
          onKeyDown={handleKeyDown}
          onChange={handleOnChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          inputRef={inputRef}
          color="secondary"
          size="small"
          error={!!errorMessage}
          InputProps={
            props.enableSpeechToText ? speechToTextButtonAdornment : {}
          }
        />
      </Box>
      <IconButton
        data-cy="send-button"
        aria-label="send message"
        onClick={handleSendMessage}
        disabled={isEmptyMessage}
        color="primary"
      >
        <Icon name="send" />
      </IconButton>
    </Box>
  )
}

TextInput.defaultProps = {
  multiline: true,
  fullWidth: true,
  maxRows: 6,
  enableSpeechToText: false,
}
