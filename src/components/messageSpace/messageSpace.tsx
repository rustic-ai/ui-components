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
  scrollDownLabel?: string
}

/**
 The `MessageSpace` component uses `MessageCanvas` and `ElementRenderer` to render a list of messages. It serves as a container for individual message items, each encapsulated within a `MessageCanvas` for consistent styling and layout. \n\n Note: For more information about the `getActionsComponent` and `getProfileComponent` fields, refer to the [MessageCanvas' docs](http://localhost:6006/?path=/docs/rustic-ui-message-canvas-message-canvas--docs).
 */
export default function MessageSpace(props: MessageSpaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isButtonShown, setIsButtonShown] = useState(false)
  const [isButtonHiddenTemporarily, setIsButtonHiddenTemporarily] =
    useState(false)
  const [areVideosLoaded, setAreVideosLoaded] = useState(false)
  const hideButtonTime = 2000

  function handleScrollDown() {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
    setIsButtonHiddenTemporarily(true)
    setTimeout(() => {
      setIsButtonHiddenTemporarily(false)
    }, hideButtonTime)
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
          container.scrollTop = container.scrollHeight
        }
      } else {
        setTimeout(scrollDownIfNeeded, 1)
      }
    }
    if (!isButtonShown) {
      setIsButtonHiddenTemporarily(true)
      setTimeout(() => {
        setIsButtonHiddenTemporarily(false)
      }, hideButtonTime)
      scrollDownIfNeeded()
    }

    const options = {
      root: containerRef.current,
      rootMargin: '16px',
      threshold: 1.0,
    }

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      setIsButtonShown(!entry.isIntersecting)
    }, options)

    const targetDiv = messagesEndRef.current
    targetDiv && intersectionObserver.observe(targetDiv)

    return () => {
      targetDiv && intersectionObserver.unobserve(targetDiv)
    }
  }, [areVideosLoaded, isButtonShown, props.messages?.length])

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
      <div ref={messagesEndRef}></div>
      {isButtonShown && !isButtonHiddenTemporarily && (
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
