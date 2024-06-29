import React from 'react'

import type { Message, TextInputProps } from '../../types'
import BaseInput from '../baseInput/baseInput'

/**
The `TextInput` component enables users to input text messages and send them over a WebSocket connection. It provides functionality for sending messages with a sender, timestamp, and conversation ID. The component integrates with the [emoji-picker-element](https://www.npmjs.com/package/emoji-picker-element) library to allow users to easily add emojis to their messages. The emoji picker can be customized through CSS variables. For detailed customization options, refer to the [emoji-picker-element documentation](https://www.npmjs.com/package/emoji-picker-element#css-variables).
 */
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
