import './promptBuilder.css'
import '../../index.css'

import { useMediaQuery } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Box, useTheme } from '@mui/system'
import React, { useEffect, useState } from 'react'

import ElementRenderer from '../elementRenderer/elementRenderer'
import Icon from '../icon/icon'
import type { Message, PromptBuilderProps } from '../types'

/**
The `PromptBuilder` component is an interactive tool designed to help users construct enhanced prompts through guided conversations with an agent. It operates in a dedicated message space, supporting multiple message formats. The conversation is structured as a thread, with the initiating message serving as the parent. Users should be able to invoke the Prompt Builder via a button click or a text input command. Once activated, the agent guides the user step-by-step to create a detailed prompt, culminating in a "Generate Prompts" button for finalization or a "Next Question" option for further refinement.

Notes for implementation:
- The Prompt Builder should be invoked with a message sent to the server. The `messageId` of this message will be used as the parent thread message of this conversation.
- The user will be allowed to start generating prompts when a message has been received with format of `promptBuilder` and data field of `isLastQuestion` set to `true`.
 */
export default function PromptBuilder(props: PromptBuilderProps) {
  const [isReadyToGenerate, setIsReadyToGenerate] = useState(false)
  const [lastAnswerMessage, setLastAnswerMessage] = useState<Message | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isAttemptingToQuit, setIsAttemptingToQuit] = useState(false)
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false)

  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const messages = props.messages || []
  const lastMessage = messages[messages.length - 1]

  const inputCapturer = {
    ...props.ws,
    send: (message: Message) => {
      setLastAnswerMessage(message)
    },
  }

  useEffect(() => {
    if (messages.length > 0) {
      if (lastMessage && lastMessage.sender !== props.sender) {
        setIsLoading(false)
      }

      if (
        lastMessage.format === 'promptBuilder' &&
        lastMessage.data.isLastQuestion
      ) {
        setIsReadyToGenerate(true)
      }
    }
  }, [props.messages?.length])

  function handleNextQuestion() {
    if (lastAnswerMessage) {
      const message = {
        ...lastAnswerMessage,
        threadId: props.messageId,
      }
      props.ws.send(message)
    }
    setLastAnswerMessage(null)
    setIsLoading(true)
  }

  function handleQuit() {
    setIsAttemptingToQuit(false)
    props.onClose()
  }

  function handleGeneratePrompts() {
    setIsGeneratingPrompts(true)
    setIsLoading(true)

    const delay = 3000
    setTimeout(() => {
      props.onGenerate()
    }, delay)
  }

  function renderMessages() {
    if (!isGeneratingPrompts) {
      return (
        props.messages &&
        props.messages.length > 0 &&
        props.messages.map((message) => {
          if (
            message.sender !== props.sender &&
            message.format !== 'promptBuilder'
          ) {
            return (
              <ElementRenderer
                key={message.id}
                ws={inputCapturer}
                sender={props.sender}
                message={message}
                supportedElements={props.supportedElements}
              />
            )
          }
        })
      )
    }
  }

  function renderNextQuestionButton() {
    return (
      <Button
        variant="outlined"
        endIcon={<Icon name="chevron_right" />}
        onClick={handleNextQuestion}
        disabled={!lastAnswerMessage}
        data-cy="next-question-button"
      >
        Next question
      </Button>
    )
  }

  function renderGenerateButton() {
    return (
      <Button
        variant="contained"
        color="secondary"
        onClick={handleGeneratePrompts}
        disabled={isLoading}
        data-cy="generate-button"
      >
        Generate
      </Button>
    )
  }

  function renderQuitButton() {
    return (
      <Button
        variant="outlined"
        startIcon={<Icon name="close" />}
        onClick={() => setIsAttemptingToQuit(true)}
        data-cy="quit-button"
      >
        Quit
      </Button>
    )
  }

  function renderMobileButtons() {
    return (
      <>
        {!isGeneratingPrompts && (
          <Box className="rustic-prompt-builder-buttons">
            <Box className="rustic-prompt-builder-buttons-left">
              {renderQuitButton()}
              {renderNextQuestionButton()}
            </Box>
            {isReadyToGenerate && (
              <Box className="rustic-prompt-builder-buttons-right">
                {renderGenerateButton()}
              </Box>
            )}
          </Box>
        )}
      </>
    )
  }

  function renderDesktopButtons() {
    return (
      <>
        {!isGeneratingPrompts && (
          <Box className="rustic-prompt-builder-buttons">
            <Box className="rustic-prompt-builder-buttons-left">
              {renderQuitButton()}
            </Box>
            <Box className="rustic-prompt-builder-buttons-right">
              {renderNextQuestionButton()}
              {isReadyToGenerate && renderGenerateButton()}
            </Box>
          </Box>
        )}
      </>
    )
  }

  function renderQuitDialog() {
    return (
      <Dialog
        open={isAttemptingToQuit}
        onClose={() => setIsAttemptingToQuit(false)}
        aria-labelledby="quit-dialog-title"
        aria-describedby="quit-dialog-description"
        sx={{
          '& .MuiPaper-root': {
            width: 'clamp(320px,50vw,600px)',
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <DialogTitle
          id="quit-dialog-title"
          className="rustic-align-self-center"
          data-cy="quit-dialog-title"
        >
          Are you sure?
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText
            id="quit-dialog-description"
            className="rustic-align-self-center"
          >
            All progress will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          className="rustic-prompt-builder-dialog-buttons"
          disableSpacing
        >
          <Button
            variant="outlined"
            startIcon={<Icon name="close" />}
            onClick={handleQuit}
            data-cy="confirm-quit-button"
          >
            Quit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsAttemptingToQuit(false)}
            data-cy="continue-build-button"
          >
            Continue build
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <Card
      variant="outlined"
      className="rustic-prompt-builder"
      data-cy="prompt-builder"
    >
      {renderQuitDialog()}
      <Box className="rustic-prompt-builder-header">
        {props.agentAvatar && (
          <Avatar
            sx={{
              border: `1px solid ${theme.palette.divider}`,
            }}
            className="rustic-prompt-builder-avatar"
            src={props.agentAvatar}
          />
        )}
        <Typography color="text.secondary" data-cy="component-title">
          {props.agentName ? props.agentName : 'Prompt Builder'}
        </Typography>
      </Box>
      <Divider className="rustic-prompt-builder-divider" />

      <Box className="rustic-prompt-builder-questions">
        {renderMessages()}
        {isLoading && (
          <CircularProgress
            color="secondary"
            className="rustic-align-self-center"
            data-cy="loading-spinner"
          />
        )}
      </Box>

      {isMobileView ? renderMobileButtons() : renderDesktopButtons()}
    </Card>
  )
}
