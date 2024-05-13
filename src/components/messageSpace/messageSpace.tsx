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

/**
 The `MessageSpace` component uses `MessageCanvas` and `ElementRenderer` to render a list of messages. It serves as a container for individual message items, each encapsulated within a `MessageCanvas` for consistent styling and layout. \n\n Note: For more information about the `getActionsComponent` and `getProfileComponent` fields, refer to the [MessageCanvas' docs](http://localhost:6006/?path=/docs/rustic-ui-message-canvas-message-canvas--docs).
 */
export default function MessageSpace(props: MessageSpaceProps) {
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [isScrollButtonHidden, setIsScrollButtonHidden] = useState(false)
  const [areVideosLoaded, setAreVideosLoaded] = useState(false)
  const hideScrollButtonDuration = 2000

  function handleScrollDown() {
    scrollEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
    setIsScrollButtonHidden(true)
    setTimeout(() => {
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

  useEffect(() => {
    function scrollDownIfNeeded() {
      if (getVideoStatus()) {
        const container = containerRef.current
        setAreVideosLoaded(true)
        if (container) {
          // Use setTimeout to delay smooth scrolling so that it can scroll to bottom
          setTimeout(() => {
            container.scrollTop = container.scrollHeight
          }, 0)
        }
      } else {
        setTimeout(scrollDownIfNeeded, 1)
      }
    }
    if (isScrolledToBottom) {
      setIsScrollButtonHidden(true)
      setTimeout(() => {
        setIsScrollButtonHidden(false)
      }, hideScrollButtonDuration)
      scrollDownIfNeeded()
    }

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
  }, [areVideosLoaded, isScrolledToBottom, props.messages?.length])

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
