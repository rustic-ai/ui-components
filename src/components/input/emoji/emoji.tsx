import './emoji.css'
import 'emoji-picker-element'

import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import Picker from 'emoji-picker-element/picker'
import type { EmojiClickEvent } from 'emoji-picker-element/shared'
import React, { useEffect, useRef, useState } from 'react'

import Icon from '../../icon/icon'

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
    handleEmojiPickerClose()
  }

  useEffect(
    function () {
      if (isEmojiPickerOpen) {
        const picker = new Picker({ emojiVersion: 15.0 })
        picker.addEventListener('emoji-click', handleEmojiClick)
        setEmojiPicker(picker)

        return function () {
          picker.removeEventListener('emoji-click', handleEmojiClick)
          setEmojiPicker(null)
        }
      }
    },
    [isEmojiPickerOpen]
  )

  return (
    <div>
      <Tooltip title="Emoji">
        <IconButton
          ref={buttonRef}
          onClick={handleButtonClick}
          data-cy="emoji-button"
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
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
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
