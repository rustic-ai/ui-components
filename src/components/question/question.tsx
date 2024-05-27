import './question.css'

import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { v4 as getUUID } from 'uuid'

import MarkedMarkdown from '../markdown/markedMarkdown'
import type { Message, QuestionProps } from '../types'

/**
The `Question` component provides a user interface for selecting an option from a list. It is designed to facilitate interactive decision-making and response submission within a conversation or messaging context.
 */
export default function Question(props: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | number>('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const buttonGroupOrientation = isMobile ? 'column' : 'row'

  function handleSubmitResponse(response: string | number) {
    setSelectedOption(response)
    const currentTime = new Date().toISOString()

    const formattedMessage: Message = {
      id: getUUID(),
      timestamp: currentTime,
      sender: props.currentUser,
      conversationId: props.conversationId,
      format: 'text',
      data: { text: response },
      inReplyTo: props.messageId,
    }

    props.ws.send(formattedMessage)
  }

  const buttonList = props.options.map((option, index) => {
    const selectedStyles = {
      '&.Mui-disabled': {
        color: 'text.primary',
        backgroundColor: 'secondary.main',
      },
    }

    return (
      <Button
        key={index}
        onClick={() => handleSubmitResponse(option)}
        variant="outlined"
        sx={selectedOption === option ? selectedStyles : {}}
        color="secondary"
        className="rustic-option"
        disabled={!!selectedOption}
      >
        {option}
      </Button>
    )
  })

  return (
    <Box className="rustic-question" data-cy="question">
      {(props.title || props.description) && (
        <Box className="rustic-question-text">
          {props.title && (
            <Typography variant="subtitle2" className="rustic-title">
              {props.title}
            </Typography>
          )}

          {props.description && <MarkedMarkdown text={props.description} />}
        </Box>
      )}

      <Stack
        direction={buttonGroupOrientation}
        data-cy="buttons-container"
        className="rustic-options-container"
      >
        {buttonList}
      </Stack>
    </Box>
  )
}
