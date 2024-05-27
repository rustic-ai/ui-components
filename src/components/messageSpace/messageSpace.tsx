import './messageSpace.css'

import Button from '@mui/material/Button'
import Box from '@mui/system/Box'
import React, { useEffect, useRef, useState } from 'react'

import ElementRenderer from '../elementRenderer/elementRenderer'
import Icon from '../icon'
import MessageCanvas, {
  type MessageContainerProps,
} from '../messageCanvas/messageCanvas'
import type { ComponentMap, ThreadableMessage, WebSocketClient } from '../types'

export interface MessageSpaceProps extends MessageContainerProps {
  /** WebSocket connection to send and receive messages to and from a backend. This can be useful for component interactions, for example, to send filter conditions, user location, etc. */
  ws: WebSocketClient
  /** Id of the current user. This can be useful for component interactions, where current user id may be required. */
  sender: string
  /** A component map contains message formats as keys and their corresponding React components as values. */
  supportedElements: ComponentMap
  messages?: ThreadableMessage[]
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

/**
 The `MessageSpace` component uses `MessageCanvas` and `ElementRenderer` to render a list of messages. It serves as a container for individual message items, each encapsulated within a `MessageCanvas` for consistent styling and layout. \n\n Note: For more information about the `getActionsComponent` and `getProfileComponent` fields, refer to the [MessageCanvas' docs](http://localhost:6006/?path=/docs/rustic-ui-message-canvas-message-canvas--docs).
 */

export default function MessageSpace(props: MessageSpaceProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  //set default value as true to avoid showing scroll down button when there's no message in the message space
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [isScrollButtonHidden, setIsScrollButtonHidden] = useState(true)
  const [areVideosLoaded, setAreVideosLoaded] = useState(false)

  const currentMessagesLength = props.messages?.length || 0
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

  function handleScrollDown() {
    scrollEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
    hideScrollButton()
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

  function scrollDownIfNeeded() {
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
      setTimeout(scrollDownIfNeeded, 1)
    }
  }

  useEffect(() => {
    scrollDownIfNeeded()
  }, [areVideosLoaded])

  function scrollToLastMessage() {
    if (getVideoStatus()) {
      const lastMessage = scrollEndRef.current

      if (lastMessage) {
        // Use setTimeout to delay smooth scrolling
        setTimeout(() => {
          lastMessage.scrollIntoView({ block: 'start', inline: 'nearest' })
        }, 0)
      }
    } else {
      setTimeout(scrollToLastMessage, 1)
    }
  }

  useEffect(() => {
    const hasNewMessage =
      previousMessagesLength !== 0 &&
      currentMessagesLength > previousMessagesLength

    if (isScrolledToBottom && hasNewMessage) {
      hideScrollButton()
      scrollToLastMessage()
    }
  }, [isScrolledToBottom, props.messages?.length])

  return (
    <Box
      ref={containerRef}
      data-cy="message-space"
      className="rustic-message-space"
    >
      {props.messages &&
        props.messages.length > 0 &&
        props.messages.map((message, index) => {
          return (
            <MessageCanvas
              key={message.id}
              message={message}
              getActionsComponent={props.getActionsComponent}
              getProfileComponent={props.getProfileComponent}
              ref={index === currentMessagesLength - 1 ? scrollEndRef : null}
            >
              <ElementRenderer
                ws={props.ws}
                sender={props.sender}
                message={message}
                supportedElements={props.supportedElements}
              />
            </MessageCanvas>
          )
        })}
      {!isScrolledToBottom && !isScrollButtonHidden && (
        <Button
          data-cy="scroll-down-button"
          variant="contained"
          className="rustic-scroll-down-button"
          onClick={handleScrollDown}
          endIcon={<Icon name="arrow_downward" className="rustic-end-icon" />}
        >
          {props.scrollDownLabel}
        </Button>
      )}
    </Box>
  )
}

MessageSpace.defaultProps = {
  scrollDownLabel: 'scroll down',
}
