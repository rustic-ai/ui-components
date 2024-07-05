import './emoji.css'
import 'emoji-picker-element'

import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import type Picker from 'emoji-picker-element/picker'
import type { EmojiClickEvent } from 'emoji-picker-element/shared'
import React, { useEffect, useRef, useState } from 'react'

import Icon from '../../icon/icon'

interface EmojiProps {
  onEmojiClick: (emoji: string) => void
  buttonColor?: string
}

function Emoji(props: EmojiProps) {
  const theme = useTheme()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const emojiPickerRef = useRef<Picker | null>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const emojiPickerStyles = {
    '--indicator-color': theme.palette.divider,
    '--background': theme.palette.background.paper,
    '--input-border-color': theme.palette.divider,
    '--outline-color': theme.palette.secondary.main,
  } as { [key: string]: string }

  function handleButtonClick() {
    setIsEmojiPickerOpen((prev) => !prev)
  }

  function handleEmojiPickerClose() {
    setIsEmojiPickerOpen(false)
  }

  function handleEmojiClick(event: EmojiClickEvent) {
    event.detail.unicode && props.onEmojiClick(event.detail.unicode)
    handleEmojiPickerClose()
  }

  useEffect(() => {
    const pickerElement = emojiPickerRef.current

    if (!pickerElement && typeof window !== 'undefined') {
      import('emoji-picker-element')
        .then((module) => {
          const Picker = module.Picker
          const picker = new Picker()
          const themeClass = theme.palette.mode === 'dark' ? 'dark' : 'light'
          picker.classList.add(themeClass)
          picker.addEventListener('emoji-click', handleEmojiClick)

          Object.keys(emojiPickerStyles).forEach((key) => {
            picker.style.setProperty(key, emojiPickerStyles[key])
          })

          emojiPickerRef.current = picker
        })
        .catch((error) => {
          console.error('Failed to load emoji picker', error)
        })
    }

    if (isEmojiPickerOpen && pickerElement) {
      pickerElement.addEventListener('emoji-click', handleEmojiClick)
    }

    return () => {
      pickerElement?.removeEventListener('emoji-click', handleEmojiClick)
    }
  }, [isEmojiPickerOpen, props.onEmojiClick])

  function appendPicker(el: HTMLDivElement | null) {
    if (el && emojiPickerRef.current && !el.contains(emojiPickerRef.current)) {
      el.appendChild(emojiPickerRef.current)
    }
  }

  return (
    <div>
      <Tooltip title="Emoji">
        <IconButton
          size="small"
          ref={buttonRef}
          onClick={handleButtonClick}
          data-cy="emoji-button"
          sx={{ color: props.buttonColor }}
        >
          <Icon name="Mood" />
        </IconButton>
      </Tooltip>
      {emojiPickerRef.current && (
        <Popover
          open={isEmojiPickerOpen}
          anchorEl={buttonRef.current}
          onClose={handleEmojiPickerClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <div
            data-cy="emoji-picker"
            className="rustic-emoji-picker"
            ref={appendPicker}
          ></div>
        </Popover>
      )}
    </div>
  )
}

export default Emoji
