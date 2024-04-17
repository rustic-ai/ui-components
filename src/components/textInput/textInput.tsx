import './textInput.css'

import MicNoneRoundedIcon from '@mui/icons-material/MicNoneRounded'
import MicRoundedIcon from '@mui/icons-material/MicRounded'
import SendIcon from '@mui/icons-material/Send'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { Message, WebSocketClient } from '../types'

export interface TextInputProps {
  ws: WebSocketClient
  /** Id of the current user. */
  sender: string
  /** Id of the current conversation. */
  conversationId: string
  /** Label text to be displayed in the input, which will then move to the top when the input is focused on. If both label and placeholder are provided, the placeholder will only be visible once the input is focused on. */
  label?: string
  /** Placeholder text to be displayed in the input before user starts typing. */
  placeholder?: string
  /** Boolean that dictates whether `TextInput` can expand to be multiline. */
  multiline?: boolean
  /** Maximum number of rows to be displayed. */
  maxRows?: number
  /** Boolean that dictates whether `TextInput` takes up 100% width of the parent container. */
  fullWidth?: boolean
  /** Boolean to allow option for speech-to-text. See which browsers are supported [here](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#browser_compatibility). */
  speechToText?: boolean
}

export default function TextInput(props: TextInputProps) {
  const [messageText, setMessageText] = useState<string>('')
  const [isRecording, setIsRecording] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isEndingRecording, setIsEndingRecording] = useState(false)

  const isEmptyMessage = !messageText.trim().length

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
    setMessageText(e.target.value)
  }

  function handleOnFocusToggle() {
    setIsFocused(!isFocused)
  }

  function handleToggleSpeechToText() {
    const microphone = new window.webkitSpeechRecognition()

    microphone.lang = 'en-US'

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
      // eslint-disable-next-line no-console
      console.log('onresult happened')
      const currentTranscript = event.results[0][0].transcript

      if (messageText.length > 0) {
        setMessageText(messageText + ' ' + currentTranscript)
      } else {
        setMessageText(currentTranscript)
      }

      setIsRecording(false)
    }

    microphone.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      setIsRecording(false)
    }

    microphone.onend = () => {
      setIsEndingRecording(false)
      setIsRecording(false)
    }
  }

  const speechToTextButtonAdornment = {
    endAdornment: (
      <InputAdornment position="end">
        {isEndingRecording ? (
          <CircularProgress size={24} data-cy="spinner" />
        ) : (
          <Tooltip title={`${isRecording ? 'Stop' : 'Start'} speech to text`}>
            <IconButton
              data-cy="record-button"
              onClick={handleToggleSpeechToText}
              size="small"
            >
              {isRecording ? (
                <MicRoundedIcon color="secondary" />
              ) : (
                <MicNoneRoundedIcon
                  sx={{
                    color: isFocused ? 'primary.main' : 'primary.light',
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        )}
      </InputAdornment>
    ),
  }

  return (
    <Box className="rustic-text-input-container">
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
        onFocus={handleOnFocusToggle}
        onBlur={handleOnFocusToggle}
        color="secondary"
        size="small"
        InputProps={props.speechToText ? speechToTextButtonAdornment : {}}
      />
      <IconButton
        data-cy="send-button"
        aria-label="send message"
        onClick={handleSendMessage}
        disabled={isEmptyMessage}
        color="primary"
      >
        <SendIcon />
      </IconButton>
    </Box>
  )
}

TextInput.defaultProps = {
  multiline: true,
  fullWidth: true,
  maxRows: 6,
}
