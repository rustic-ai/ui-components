import './question.css'

import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Typography from '@mui/material/Typography'
import React from 'react'
import { v4 as getUUID } from 'uuid'

import MarkedMarkdown from '../markdown/markedMarkdown'
import type { Message, QuestionData } from '../types'

/**
'The `Question` component provides a user interface for selecting an answer a list of choices. It is designed to facilitate interactive decision-making and response submission within a conversation or messaging context.
 */
export default function Question(props: QuestionData) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const buttonGroupOrientation = isMobile ? 'vertical' : 'horizontal'

  function handleSubmitResponse(response: string) {
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
    return (
      <Button
        key={answer.value}
        onClick={() => handleSubmitResponse(answer.label)}
      >
        {answer.label}
      </Button>
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
        <ButtonGroup
          fullWidth
          orientation={buttonGroupOrientation}
          color="secondary"
          data-cy="button-group"
        >
          {buttonList}
        </ButtonGroup>
      ) : (
        <Typography variant="caption" data-cy="no-answers-message">
          No answers were provided.
        </Typography>
      )}
    </Box>
  )
}
