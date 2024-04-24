import './choiceSelector.css'

import { useMediaQuery, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { v4 as getUUID } from 'uuid'

import MarkedMarkdown from '../markdown/markedMarkdown'
import type { Message, WebSocketClient } from '../types'

export interface ChoiceSelectorProps {
  ws: WebSocketClient
  /** Id of the current user. */
  sender: string
  /** Id of the current conversation. */
  conversationId: string
  /** Id of this message. Submitted responses will appear as a new message in reply to this message. */
  messageId: string
  /** Optional prompt text. Use this to provide context, instructions or a question. Supports markdown. */
  prompt?: string
  /** Array of choices to display. */
  choices: string[]
  /** Value to keep track of the selected choice(s). */
  savedResponse?: string[]
  /** Boolean indicating that multiple selections are accepted. */
  acceptsMultiple?: boolean
}

export default function ChoiceSelector(props: ChoiceSelectorProps) {
  const [savedResponse, setSavedResponse] = useState<string[]>(
    props.savedResponse || []
  )
  const [isResponseSubmitted, setIsResponseSubmitted] = useState(
    !!props.savedResponse
  )

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const buttonGroupOrientation = isMobile ? 'vertical' : 'horizontal'

  function handleSubmitResponse(response: string[]) {
    const currentTime = new Date().toISOString()
    const responseString = response.join(', ')

    const formattedMessage: Message = {
      id: getUUID(),
      timestamp: currentTime,
      sender: props.sender,
      conversationId: props.conversationId,
      format: 'text',
      data: { text: responseString },
      inReplyTo: props.messageId,
    }

    setIsResponseSubmitted(true)
    props.ws.send(formattedMessage)
  }

  function handleOnChangeExclusive(
    event: React.MouseEvent<HTMLElement>,
    newValue: string
  ) {
    const recentResponse = [newValue]
    setSavedResponse(recentResponse)
    handleSubmitResponse(recentResponse)
  }

  function handleOnChangeMultiple(
    event: React.MouseEvent<HTMLElement>,
    newValue: string[]
  ) {
    setSavedResponse(newValue)
  }

  const buttonList = props.choices.map((choice) => {
    return (
      <ToggleButton key={choice} value={choice} sx={{ color: 'text.primary' }}>
        {choice}
      </ToggleButton>
    )
  })

  return (
    <Box className="rustic-choice-selector" data-cy="choice-selector">
      {props.prompt && <MarkedMarkdown text={props.prompt} />}

      {props.choices.length > 0 ? (
        <ToggleButtonGroup
          fullWidth
          orientation={buttonGroupOrientation}
          color="secondary"
          data-cy="button-group"
          value={savedResponse}
          onChange={
            props.acceptsMultiple
              ? handleOnChangeMultiple
              : handleOnChangeExclusive
          }
          exclusive={!props.acceptsMultiple}
          disabled={isResponseSubmitted}
        >
          {buttonList}
        </ToggleButtonGroup>
      ) : (
        <Typography variant="caption" data-cy="no-choices-message">
          No choice selections were provided.
        </Typography>
      )}

      {props.acceptsMultiple && (
        <Button
          fullWidth
          variant="contained"
          className="rustic-submit-button"
          data-cy="submit-button"
          onClick={() => handleSubmitResponse(savedResponse)}
          disabled={isResponseSubmitted}
        >
          Submit
        </Button>
      )}
    </Box>
  )
}

ChoiceSelector.defaultProps = {
  acceptsMultiple: false,
}
