import React from 'react'

import Icon from '../../../icon'
import type { ThreadableMessage } from '../../../types'
import Action from '../index'

export interface CopyProps {
  message: ThreadableMessage
}

export default function Copy(props: CopyProps) {
  return (
    <Action
      message={props.message}
      icon={<Icon name="file_copy" />}
      onClick={(message: ThreadableMessage) => {
        if (message.data.text) {
          navigator.clipboard.writeText(message.data.text)
        }
      }}
      label="Copy"
    />
  )
}
