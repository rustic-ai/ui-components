import './baseInput.css'

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
import type { BaseInputProps, Message } from '../../types'

export default function BaseInput(
  props: React.PropsWithChildren<BaseInputProps>
) {
  const [messageText, setMessageText] = useState<string>('')
  const [isRecording, setIsRecording] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isEndingRecording, setIsEndingRecording] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const isEmptyMessage = !messageText.trim().length
  const isSendDisabled = props.isSendEnabled
    ? !props.isSendEnabled
    : isEmptyMessage

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

      props.setErrorMessages && props.setErrorMessages([errorDescription])
      setIsRecording(false)
    }

    microphone.onend = () => {
      setIsEndingRecording(false)
      setIsRecording(false)
    }
  }

  function handleSendMessage(): void {
    const currentTime = new Date().toISOString()
    const formattedMessage: Message = {
      id: getUUID(),
      timestamp: currentTime,
      sender: props.sender,
      conversationId: props.conversationId,
      format: 'text',
      data: { text: messageText },
    }

    props.send(formattedMessage)
    setMessageText('')
    props.setErrorMessages && props.setErrorMessages([])
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      !isSendDisabled && handleSendMessage()
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    props.setErrorMessages && props.setErrorMessages([])
    setMessageText(e.target.value)
  }

  return (
    <Box className="rustic-base-input">
      {props.errorMessages &&
        props.errorMessages.map((errorMessage, index) => (
          <Typography
            variant="caption"
            color="error"
            className="rustic-error-message"
            key={index}
            data-cy="error-message"
          >
            {errorMessage}
          </Typography>
        ))}
      <TextField
        data-cy="text-field"
        className="rustic-text-field"
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
        error={!!props.errorMessages}
        InputProps={props.enableSpeechToText ? speechToTextButtonAdornment : {}}
      />
      <Box className="rustic-input-actions">
        {props.children}
        <IconButton
          data-cy="send-button"
          aria-label="send message"
          onClick={handleSendMessage}
          disabled={isSendDisabled}
          color="primary"
          className="rustic-send-button"
        >
          <Icon name="send" />
        </IconButton>
      </Box>
    </Box>
  )
}

BaseInput.defaultProps = {
  multiline: true,
  fullWidth: true,
  maxRows: 6,
  enableSpeechToText: false,
}
