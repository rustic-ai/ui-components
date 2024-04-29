import React from 'react'

import type { Message, TextInputProps } from '../../types'
import BaseInput from '../baseInput/baseInput'

export default function TextInput(props: TextInputProps) {
  const { ws, ...baseInputProps } = props

  function handleSendMessage(message: Message): void {
    ws.send(message)
  }

  return (
    <BaseInput
      {...baseInputProps}
      send={handleSendMessage}
      data-cy="text-input"
    />
  )
}
