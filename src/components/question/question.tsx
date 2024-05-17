import './question.css'

import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { v4 as getUUID } from 'uuid'

import MarkedMarkdown from '../markdown/markedMarkdown'
import type { Message, QuestionData } from '../types'

/**
'The `Question` component provides a user interface for selecting an answer from a list of choices. It is designed to facilitate interactive decision-making and response submission within a conversation or messaging context.
 */
export default function Question(props: QuestionData) {
  const [selectedAnswer, setSelectedAnswer] = useState('')

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const buttonGroupOrientation = isMobile ? 'vertical' : 'horizontal'

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
    const selectedStyles = {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
    }

    return (
      <ToggleButton
        key={answer.label}
        value={answer.label}
        sx={{
          color: theme.palette.text.primary,
          '&.Mui-selected': selectedStyles,
        }}
      >
        {answer.label}
      </ToggleButton>
    )
  })

  return (
    <Box className="rustic-question" data-cy="question">
      {props.title && (
        <Typography variant="subtitle2" className="rustic-question-title">
          {props.title}
        </Typography>
      )}

      {props.description && <MarkedMarkdown text={props.description} />}

      {props.answers.length > 0 ? (
        <ToggleButtonGroup
          fullWidth
          orientation={buttonGroupOrientation}
          data-cy="button-group"
          value={selectedAnswer}
          onChange={(event, newValue) => {
            setSelectedAnswer(newValue)
            handleSubmitResponse(newValue)
          }}
          exclusive
          disabled={!!selectedAnswer}
        >
          {buttonList}
        </ToggleButtonGroup>
      ) : (
        <Typography variant="caption" data-cy="no-answers-message">
          No answers were provided.
        </Typography>
      )}
    </Box>
  )
}
