import './messageSpace.css'

import Button from '@mui/material/Button'
import Box from '@mui/system/Box'
import React, { useEffect, useRef, useState } from 'react'

import ElementRenderer from '../elementRenderer/elementRenderer'
import Icon from '../icon'
import MessageCanvas, {
  type MessageContainerProps,
} from '../messageCanvas/messageCanvas'
import type { ComponentMap, ThreadableMessage } from '../types'

export interface MessageSpaceProps extends MessageContainerProps {
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

  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
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
      block: 'nearest',
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

  //show or hide scroll button
  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: '16px',
      threshold: 1.0,
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      setIsScrolledToBottom(entry.isIntersecting)
    }, options)

    const targetDiv = scrollEndRef.current
    targetDiv && intersectionObserver.observe(targetDiv)

    return () => {
      targetDiv && intersectionObserver.unobserve(targetDiv)
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
      const container = containerRef.current
      const childrenComponent = container && container.children
      // scroll end div is also accounted as children component
      const minimumChildrenLength = 2
      if (
        childrenComponent &&
        childrenComponent.length >= minimumChildrenLength
      ) {
        const lastMessage =
          childrenComponent[childrenComponent.length - minimumChildrenLength]

        if (lastMessage) {
          // Use setTimeout to delay smooth scrolling
          setTimeout(() => {
            lastMessage.scrollIntoView({ block: 'start', inline: 'nearest' })
          }, 0)
        }
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
        props.messages.map((message) => {
          return (
            <MessageCanvas
              key={message.id}
              message={message}
              getActionsComponent={props.getActionsComponent}
              getProfileComponent={props.getProfileComponent}
            >
              <ElementRenderer
                message={message}
                supportedElements={props.supportedElements}
              />
            </MessageCanvas>
          )
        })}
      <div ref={scrollEndRef}></div>
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
