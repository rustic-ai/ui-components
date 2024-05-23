import './question.css'

import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { v4 as getUUID } from 'uuid'

import Icon from '../icon'
import MarkedMarkdown from '../markdown/markedMarkdown'
import type { Message, QuestionData } from '../types'

/**
'The `Question` component provides a user interface for selecting an answer from a list of choices. It is designed to facilitate interactive decision-making and response submission within a conversation or messaging context.
 */
export default function Question(props: QuestionData) {
  const [selectedAnswer, setSelectedAnswer] = useState('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const buttonGroupOrientation = isMobile ? 'column' : 'row'

  function handleSubmitResponse(response: string) {
    setSelectedAnswer(response)
    const currentTime = new Date().toISOString()

    const formattedMessage: Message = {
      id: getUUID(),
      timestamp: currentTime,
      sender: props.sender,
      conversationId: props.conversationId,
      format: 'text',
      data: { text: response },
      inReplyTo: props.messageId,
    }

    props.ws.send(formattedMessage)
  }

  const buttonList = props.answers.map((answer) => {
    let buttonStyles = {
      borderColor: 'primary.main',
      color: 'text.primary',
    }

    const selectedStyles = {
      backgroundColor: 'secondary.main',
    }

    if (answer.label === selectedAnswer) {
      buttonStyles = {
        ...buttonStyles,
        ...selectedStyles,
      }
    }

    return (
      <Button
        key={answer.label}
        onClick={() => handleSubmitResponse(answer.label)}
        variant="outlined"
        sx={buttonStyles}
        startIcon={selectedAnswer === answer.label && <Icon name="check" />}
        className="rustic-question-answer-button"
      >
        {answer.label}
      </Button>
    )
  })

  return (
    <Box className="rustic-question" data-cy="question">
      {(props.title || props.description) && (
        <Box className="rustic-question-text">
          {props.title && (
            <Typography variant="subtitle2" className="rustic-question-title">
              {props.title}
            </Typography>
          )}

          {props.description && <MarkedMarkdown text={props.description} />}
        </Box>
      )}

      {props.answers.length > 0 ? (
        <Stack
          direction={buttonGroupOrientation}
          spacing={1}
          data-cy="buttons-container"
        >
          {buttonList}
        </Stack>
      ) : (
        <Typography variant="caption" data-cy="no-answers-message">
          No answers were provided.
        </Typography>
      )}
    </Box>
  )
}
