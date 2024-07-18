import './promptBuilder.css'
import '../../index.css'

import { useMediaQuery } from '@mui/material'
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
The `PromptBuilder` component is an interactive tool designed to help end users construct enhanced prompts through guided conversations with an agent. Users should be able to invoke the PromptBuilder via a button click or a text input command. Once activated, the agent guides the user step-by-step to create a detailed prompt, culminating in a "Generate" button for finalization or a "Next Question" option for further refinement.

The expected output of the `PromptBuilder` should not be direct answers to the gathered input. Instead, when the "Generate" button is clicked, the component should produce refined prompt suggestion(s) based on the user's responses during the guided conversation. The `PromptBuilder` does not display the results directly; instead, developers can use the `onSubmit` function to handle the output and choose the most appropriate place to present it within their application.

Try out the chat application example below to see how the `PromptBuilder` component can be used in your own application. Please note that the questions asked by agent are fixed as there is no backend involved. This is showcasing an example flow and use case.

Notes for implementation:
- The user will be allowed to start generating prompts when a message has been received with format of `"promptBuilder"` and data field of `isLastQuestion` set to `true`. For example:
```
const newMessage = {
    ...otherRequiredFields,
    format: 'promptBuilder',
    data: {
      isLastQuestion: true
    }
}
```
 */
export default function PromptBuilder(props: PromptBuilderProps) {
  const [isReadyToGenerate, setIsReadyToGenerate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAttemptingToQuit, setIsAttemptingToQuit] = useState(false)
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [lastInputMessage, setLastInputMessage] = useState<Message | null>(null)

  const theme = useTheme()
  const isMobileView = useMediaQuery(theme.breakpoints.down('md'))
  const lastMessage = messages[messages.length - 1]

  const inputCapturer = {
    ...props.ws,
    send: (message: Message) => {
      setLastInputMessage(message)
    },
  }

  useEffect(() => {
    function handleIncomingMessage(event: MessageEvent) {
      const receivedMessage = JSON.parse(event.data)
      setMessages((prev) => [...prev, receivedMessage])
    }

    props.ws.onReceive(handleIncomingMessage)
  }, [props.ws])

  useEffect(() => {
    if (messages.length > 0) {
      if (lastMessage && lastMessage.sender.id !== props.sender.id) {
        setIsLoading(false)
      }

      if (
        lastMessage.format === 'promptBuilder' &&
        lastMessage.data.isLastQuestion
      ) {
        setIsReadyToGenerate(true)
      }
    }
  }, [messages.length])

  function handleNextQuestion() {
    if (lastInputMessage) {
      const message = {
        ...lastInputMessage,
        threadId: props.messageId,
      }
      props.ws.send(message)
    }
    setLastInputMessage(null)
    setIsLoading(true)
  }

  function handleQuit() {
    setIsAttemptingToQuit(false)
    props.onCancel()
  }

  function handleGeneratePrompts() {
    setIsGeneratingPrompts(true)
    setIsLoading(true)
    props.onSubmit()
  }

  function renderMessages() {
    if (!isGeneratingPrompts) {
      return (
        messages.length > 0 &&
        messages.map((message) => {
          if (
            message.sender.id !== props.sender.id &&
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
        disabled={!lastInputMessage}
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

  function renderHeader() {
    if (props.getProfileComponent) {
      return props.getProfileComponent(messages[0])
    } else {
      return (
        <Typography color="text.secondary" data-cy="component-title">
          Prompt Builder
        </Typography>
      )
    }
  }

  // Rendered when the first message is received to give props.getProfileComponent access to the agent sender details
  if (messages.length !== 0) {
    return (
      <Card
        variant="outlined"
        className="rustic-prompt-builder"
        data-cy="prompt-builder"
      >
        {renderQuitDialog()}
        {renderHeader()}
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
}
