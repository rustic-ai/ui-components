import './emoji.css'
import 'emoji-picker-element'

import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import type { EmojiClickEvent } from 'emoji-picker-element/shared'
import React, { useEffect, useRef, useState } from 'react'

import Icon from '../../icon/icon'

interface EmojiPickerElement extends HTMLElement {
  database: { close: () => void }
}

interface EmojiProps {
  onEmojiClick: (emoji: string) => void
}

function Emoji(props: EmojiProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [emojiPicker, setEmojiPicker] = useState<Element | null>(null)

  function handleButtonClick() {
    setIsEmojiPickerOpen((prev) => !prev)
  }

  function handleEmojiPickerClose() {
    setIsEmojiPickerOpen(false)
  }

  function handleEmojiClick(event: EmojiClickEvent) {
    event.detail.unicode && props.onEmojiClick(event.detail.unicode)
    const pickerElement = document.querySelector(
      'emoji-picker'
    ) as EmojiPickerElement
    pickerElement?.database.close()
    handleEmojiPickerClose()
  }

  useEffect(() => {
    if (isEmojiPickerOpen && typeof window !== 'undefined') {
      import('emoji-picker-element')
        .then((module) => {
          const Picker = module.Picker
          const picker = new Picker()

          picker.addEventListener('emoji-click', handleEmojiClick)
          setEmojiPicker(picker)
        })
        .catch((error) => {
          console.error('Failed to load emoji picker', error)
        })

      return () => {
        setEmojiPicker(null)
      }
    }
  }, [isEmojiPickerOpen])

  return (
    <div>
      <Tooltip title="Emoji">
        <IconButton
          size="small"
          ref={buttonRef}
          onClick={handleButtonClick}
          data-cy="emoji-button"
          color="primary"
        >
          <Icon name="Mood" />
        </IconButton>
      </Tooltip>
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
        {emojiPicker && (
          <div
            data-cy="emoji-picker"
            className="rustic-emoji-picker"
            ref={(el) => el && el.appendChild(emojiPicker)}
          ></div>
        )}
      </Popover>
    </div>
  )
}

export default Emoji
