import React, { useState } from 'react'

import Icon from '../../../icon/icon'
import type { ThreadableMessage } from '../../../types'
import Action from '../index'

export interface CopyTextProps {
  message: ThreadableMessage
}

export default function CopyText(props: CopyTextProps) {
  const [tooltipContent, setTooltipContent] = useState('Copy text')
  const twoSeconds = 2000

  function handleOnClick(message: ThreadableMessage) {
    if (message.data.text) {
      navigator.clipboard
        .writeText(message.data.text)
        .then(() => {
          setTooltipContent('Copied')
          setTimeout(() => {
            setTooltipContent('Copy text')
          }, twoSeconds)
        })
        .catch(() => {
          setTooltipContent('Failed to copy')
        })
    }
  }

  return (
    <Action
      message={props.message}
      icon={<Icon name="file_copy" />}
      onClick={handleOnClick}
      label={tooltipContent}
    />
  )
}
