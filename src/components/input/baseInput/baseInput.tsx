import './baseInput.css'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { Database } from 'emoji-picker-element'
import type { Emoji as EmojiInfo } from 'emoji-picker-element/shared'
import { type ForwardedRef, forwardRef, useRef, useState } from 'react'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import Icon from '../../icon/icon'
import type { BaseInputProps, Message } from '../../types'
import Emoji from '../emoji/emoji'

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

function showEmojiInfo(emoji: EmojiInfo) {
  if ('unicode' in emoji && 'annotation' in emoji) {
    return `${emoji.unicode} ${emoji.annotation}`
  }
}

function BaseInputElement(
  props: React.PropsWithChildren<BaseInputProps>,
  ref: ForwardedRef<HTMLDivElement>
) {
  const [messageText, setMessageText] = useState<string>('')
  const [isRecording, setIsRecording] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isEndingRecording, setIsEndingRecording] = useState(false)
  const [speechToTextError, setSpeechToTextError] = useState<string>('')
  const [emojiSearchResults, setEmojiSearchResults] = useState<EmojiInfo[]>([])
  const [isEmojiMenuShown, setIsEmojiMenuShown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isEmptyMessage = !messageText.trim().length
  const isSendDisabled = isEmptyMessage && !props.isSendEnabled

  const speechToTextTooltipTitle = `${isRecording ? 'Stop' : 'Start'} speech to text`
  const featureButtonColor = isFocused ? 'primary.main' : 'primary.light'
  const speechToTextIconColor = isRecording ? 'error.main' : featureButtonColor
  const speechToTextIconName = isRecording ? 'stop_circle' : 'speech_to_text'

  function handleEmojiClick(
    emoji: string,
    shouldEmojiShortcodeBeReplaced: boolean = false
  ) {
    if (inputRef.current) {
      const { selectionStart, selectionEnd } = inputRef.current

      if (
        typeof selectionStart === 'number' &&
        typeof selectionEnd === 'number'
      ) {
        const currentText = messageText || ''
        const startText = currentText.substring(0, selectionStart)
        const endText = currentText.substring(selectionEnd)
        let newText

        if (shouldEmojiShortcodeBeReplaced) {
          newText = startText.replace(/:(\w+)$/, emoji) + endText
        } else {
          newText = startText + emoji + endText
        }

        setMessageText(newText)

        const newPosition = shouldEmojiShortcodeBeReplaced
          ? startText.replace(/:(\w+)$/, emoji).length
          : selectionStart + emoji.length

        // focus doesn't work without setTimeout
        setTimeout(() => {
          inputRef.current?.focus()
          inputRef.current?.setSelectionRange(newPosition, newPosition)
        }, 0)
      }
    }

    setIsEmojiMenuShown(false)
  }

  const database = new Database()

  function searchEmojis(query: string) {
    database
      .getEmojiBySearchQuery(query)
      .then((results) => {
        if (results.length) {
          setEmojiSearchResults(
            results.slice(0, props.maximumEmojiSearchResults)
          )
          setIsEmojiMenuShown(true)
        } else {
          setEmojiSearchResults([])
          setIsEmojiMenuShown(false)
        }
      })
      .catch(() => {
        setEmojiSearchResults([])
        setIsEmojiMenuShown(false)
      })
  }

  const speechToTextButtonAdornment = isEndingRecording ? (
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
  )

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
      setSpeechToTextError('')
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

      setSpeechToTextError(errorDescription)
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
    setSpeechToTextError('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      !isSendDisabled && handleSendMessage()
    }
  }

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setSpeechToTextError('')
    const newText = e.target.value
    setMessageText(newText)

    // expression to match ':text:' format
    const closedShortcode = newText.match(/:(\w{2,}):/g)
    // expression to match ':something' format
    const unclosedShortcode = newText.match(/:(\w{2,})/g)

    if (closedShortcode) {
      const shortcode = closedShortcode[0].replace(/:/g, '')

      database
        .getEmojiByShortcode(shortcode)
        .then((emoji) => {
          if (emoji && 'unicode' in emoji) {
            const replacedText = newText.replace(
              closedShortcode[0],
              emoji.unicode
            )
            setMessageText(replacedText)
          } else {
            setMessageText(newText)
          }
        })
        .catch(() => {
          setMessageText(newText)
        })
      setIsEmojiMenuShown(false)
    } else if (unclosedShortcode) {
      const query = unclosedShortcode[0].replace(':', '')
      searchEmojis(query)
    } else {
      setIsEmojiMenuShown(false)
    }
  }

  return (
    <Box className="rustic-base-input" ref={ref} data-cy="base-input">
      <Box className="rustic-error-and-input-container">
        <Box className="rustic-error-container">
          <Typography
            variant="caption"
            color="error"
            className="rustic-error-message"
            data-cy="error-message"
          >
            {speechToTextError}
          </Typography>
        </Box>
        <Box
          className="rustic-input-field"
          sx={{
            border: '1px solid',
            borderColor: isFocused ? 'secondary.main' : 'action.disabled',
          }}
        >
          {emojiSearchResults.length > 0 && (
            <Popover
              open={isEmojiMenuShown}
              anchorEl={inputRef.current}
              onClose={() => setIsEmojiMenuShown(false)}
              disableAutoFocus={true}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <MenuList data-cy="emoji-menu">
                {emojiSearchResults.map(
                  (emoji, index) =>
                    'unicode' in emoji && (
                      <MenuItem
                        key={index}
                        onClick={() => handleEmojiClick(emoji.unicode, true)}
                      >
                        {showEmojiInfo(emoji)}
                      </MenuItem>
                    )
                )}
              </MenuList>
            </Popover>
          )}

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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Emoji
                    onEmojiClick={handleEmojiClick}
                    buttonColor={featureButtonColor}
                  />
                  {props.enableSpeechToText && speechToTextButtonAdornment}
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              className: !isFocused ? 'rustic-input-label' : '',
              sx: {
                backgroundColor: 'background.paper',
              },
            }}
          />
          <div className="rustic-input-extras"></div>
        </Box>
      </Box>
      <Box className="rustic-input-actions">
        {props.children}
        <Tooltip title="Send">
          <span>
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
          </span>
        </Tooltip>
      </Box>
    </Box>
  )
}

const BaseInput = forwardRef(BaseInputElement)

BaseInput.defaultProps = {
  multiline: true,
  fullWidth: true,
  maxRows: 6,
  enableSpeechToText: false,
  maximumEmojiSearchResults: 5,
}

export default BaseInput
