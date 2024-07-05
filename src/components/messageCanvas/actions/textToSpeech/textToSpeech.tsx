import React, { useState } from 'react'

import Icon from '../../../icon/icon'
import type { ThreadableMessage } from '../../../types'
import Action from '../index'

export interface TextToSpeechProps {
  message: ThreadableMessage
}

export default function TextToSpeech(props: TextToSpeechProps) {
  const [tooltipContent, setTooltipContent] = useState('Text to speech')
  const [isPlaying, setIsPlaying] = useState(false)

  const content = [
    props.message.data.title,
    props.message.data.description,
    props.message.data.alt,
    props.message.data.text,
  ]
  const combinedText = content.filter(Boolean).join(' ')
  const utterance = new SpeechSynthesisUtterance(combinedText)

  function handleOnClick() {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setTooltipContent('Text to speech')
    } else {
      utterance.onend = () => {
        setIsPlaying(false)
        setTooltipContent('Text to speech')
      }
      window.speechSynthesis.speak(utterance)
      setIsPlaying(true)
      setTooltipContent('Stop speech')
    }
  }

  return (
    <Action
      message={props.message}
      icon={<Icon name="text_to_speech" />}
      onClick={handleOnClick}
      label={tooltipContent}
    />
  )
}
