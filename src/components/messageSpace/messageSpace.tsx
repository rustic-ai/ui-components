import './messageSpace.css'

import Chip from '@mui/material/Chip'
import Box from '@mui/system/Box'
import React, { useEffect, useRef, useState } from 'react'

import ElementRenderer from '../elementRenderer/elementRenderer'
import Icon from '../icon/icon'
import MessageCanvas, {
  type MessageContainerProps,
} from '../messageCanvas/messageCanvas'
import type { ComponentMap, Message, Sender, WebSocketClient } from '../types'

export interface MessageSpaceProps extends MessageContainerProps {
  /** WebSocket connection to send and receive messages to and from a backend. This can be useful for component interactions, for example, to send filter conditions, user location, etc. */
  ws: WebSocketClient
  /** Current user. This can be useful for component interactions, where current user id may be required. */
  sender: Sender
  /** A component map contains message formats as keys and their corresponding React components as values. */
  supportedElements: ComponentMap
  /** Messages received before the component was mounted. These messages are rendered along with new messages received from the websocket. */
  receivedMessages?: Message[]
  /** Text label for scroll down button. Default value is 'scroll down'. */
  scrollDownLabel?: string
}

function usePrevious(value: number) {
  const ref = useRef<number>(0)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

function getCombinedMessages(
  messages: { [key: string]: Message[] },
  message: Message
) {
  let key

  if (message.format.includes('update')) {
    key = message.threadId
  } else if (message.format.includes('Response')) {
    key = message.inReplyTo
  } else {
    key = message.id
  }

  if (key) {
    const newMessages = { ...messages }
    const existingMessages = messages[key] || []
    const originalMessage = existingMessages[0]

    // Check if sender is the same for update messages
    if (
      message.format.includes('update') &&
      originalMessage &&
      originalMessage.sender.id !== message.sender.id
    ) {
      key = message.id
    }

    if (!newMessages[key]) {
      newMessages[key] = []
    }

    newMessages[key] = newMessages[key].concat(message)

    return newMessages
  } else {
    return messages
  }
}

/**
 The `MessageSpace` component uses `MessageCanvas` and `ElementRenderer` to render a list of messages. It serves as a container for individual message items, each encapsulated within a `MessageCanvas` for consistent styling and layout. It can receive and process messages to dynamically update the displayed content.

 The `MessageSpace` component can combine update messages with the original message and render them as a single message. For this to work, the `threadId` of the update message must match the `id` of the original message, and the format of the update message should be prefixed with 'update'. For example, if the original message format is 'streamingText', the update message format should be 'updateStreamingText'.
 
 Note: For more information about the `getActionsComponent` and `getProfileComponent` fields, refer to the [MessageCanvas' docs](http://localhost:6006/?path=/docs/rustic-ui-message-canvas-message-canvas--docs).
*/

export default function MessageSpace(props: MessageSpaceProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  //set default value as true to avoid showing scroll down button when there's no message in the message space
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [isScrollButtonHidden, setIsScrollButtonHidden] = useState(true)
  const [areVideosLoaded, setAreVideosLoaded] = useState(false)
  const [chatMessages, setChatMessages] = useState<{
    [messageId: string]: Message[]
  }>({})
  const currentMessagesLength = Object.keys(chatMessages).length
  const previousMessagesLength = usePrevious(currentMessagesLength)
  const hideScrollButtonDuration = 2000

  function hideScrollButton() {
    setIsScrollButtonHidden(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsScrollButtonHidden(false)
    }, hideScrollButtonDuration)
  }

  function getVideoStatus() {
    const videos = containerRef.current?.querySelectorAll('video')
    if (!videos || videos.length === 0) {
      return true
    }
    return Array.from(videos).every((video) => video.readyState >= 1)
  }

  function checkIntersection() {
    const container = containerRef.current
    const lastMessage = scrollEndRef.current
    if (container && lastMessage) {
      const containerBottom = container.getBoundingClientRect().bottom
      const targetBottom = lastMessage.getBoundingClientRect().bottom
      //targetBottom is slightly larger than containerBottom when it's scrolled to bottom. But the difference is always less than 1.
      const bottomDistanceTolerance = 1
      setIsScrolledToBottom(
        targetBottom - bottomDistanceTolerance <= containerBottom
      )
    }
  }

  useEffect(() => {
    const container = containerRef.current

    checkIntersection()

    if (container) {
      container.addEventListener('scroll', checkIntersection)
      window.addEventListener('resize', checkIntersection)

      return () => {
        container.removeEventListener('scroll', checkIntersection)
        window.removeEventListener('resize', checkIntersection)
      }
    }
  }, [isScrolledToBottom])

  function scrollDown() {
    if (getVideoStatus()) {
      const container = containerRef.current
      setAreVideosLoaded(true)
      if (container) {
        // Use setTimeout to delay smooth scrolling so that it can scroll to bottom
        setTimeout(() => {
          hideScrollButton()
          container.scrollTop = container.scrollHeight
        }, 0)
      }
    } else {
      setTimeout(scrollDown, 1)
    }
  }

  useEffect(() => {
    scrollDown()
  }, [areVideosLoaded])

  useEffect(() => {
    const hasNewMessage =
      previousMessagesLength !== 0 &&
      currentMessagesLength > previousMessagesLength

    if (isScrolledToBottom && hasNewMessage) {
      hideScrollButton()
      scrollDown()
    }
  }, [isScrolledToBottom, Object.keys(chatMessages).length])

  useEffect(() => {
    let messageDict: { [messageId: string]: Message[] } = {}

    props.receivedMessages?.forEach((message) => {
      const newMessageDict = getCombinedMessages(messageDict, message)
      messageDict = newMessageDict
    })

    setChatMessages(messageDict)
  }, [props.receivedMessages?.length])

  function handleIncomingMessage(message: Message) {
    setChatMessages((prevMessages) =>
      getCombinedMessages(prevMessages, message)
    )
  }

  useEffect(() => {
    if (props.ws.onReceive) {
      props.ws.onReceive(handleIncomingMessage)
    }
  }, [])

  return (
    <Box
      ref={containerRef}
      data-cy="message-space"
      className="rustic-message-space"
    >
      {Object.keys(chatMessages).map((key, index) => {
        const messages = chatMessages[key]
        const lastestMessage = messages[messages.length - 1]
        return (
          <MessageCanvas
            key={key}
            message={lastestMessage}
            getActionsComponent={props.getActionsComponent}
            getProfileComponent={props.getProfileComponent}
            ref={index === currentMessagesLength - 1 ? scrollEndRef : null}
          >
            <ElementRenderer
              ws={props.ws}
              sender={props.sender}
              messages={messages}
              supportedElements={props.supportedElements}
            />
          </MessageCanvas>
        )
      })}
      {!isScrolledToBottom && !isScrollButtonHidden && (
        <Chip
          data-cy="scroll-down-button"
          variant="rusticSecondary"
          className="rustic-scroll-down-button"
          size="medium"
          onClick={scrollDown}
          label={
            <>
              {props.scrollDownLabel}
              <Icon name="arrow_downward" />
            </>
          }
        />
      )}
    </Box>
  )
}

MessageSpace.defaultProps = {
  scrollDownLabel: 'Scroll down',
}
