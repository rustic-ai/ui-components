import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { Message, TextInputProps } from '../../types'
import BaseInput from '../baseInput/baseInput'

export default function TextInput(props: TextInputProps) {
  const { ws, ...baseInputProps } = props

  function handleSendMessage(message: Message): void {
    message.id = getUUID()
    ws.send(message)
  }

  return <BaseInput {...baseInputProps} send={handleSendMessage} />
}
