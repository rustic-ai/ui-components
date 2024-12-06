import './prompts.css'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import type { Message, PromptsProps } from '../types'

export default function Prompts(props: PromptsProps) {
  function handleSubmitResponse(response: string | number) {
    const currentTime = new Date().toISOString()

    const formattedMessage: Message = {
      id: getUUID(),
      timestamp: currentTime,
      sender: props.sender,
      conversationId: props.conversationId,
      format: 'text',
      data: { text: response },
    }

    props.ws.send(formattedMessage)
  }

  const buttonList = props.prompts.map((prompt, index) => {
    return (
      <Chip
        key={index}
        onClick={() => handleSubmitResponse(prompt)}
        variant="rusticSecondary"
        size="small"
        className="rustic-prompt"
        label={prompt}
      ></Chip>
    )
  })

  return (
    <Box data-cy="buttons-container" className={props.className}>
      {buttonList}
    </Box>
  )
}
