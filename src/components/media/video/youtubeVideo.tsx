import '../../../index.css'

import DOMPurify from 'dompurify'
import React from 'react'

import { getSizeStyles } from '../../helper'

export interface YoutubeVideoProps {
  /** The string after "?v=" parameter of YouTube URLs. */
  youtubeVideoId: string
  /** Width rendered in pixels. If neither width nor height are provided, the video will be set to be contained in the parent container. */
  width?: number
  /** Height rendered in pixels. */
  height?: number
  /** Title of the video used for assistive technology. */
  title?: string
}

export default function YoutubeVideo(props: YoutubeVideoProps) {
  const sanitizedYoutubeVideoId = DOMPurify.sanitize(props.youtubeVideoId)

  return (
    <iframe
      {...getSizeStyles(props.width, props.height)}
      data-cy="youtube-video-iframe"
      src={`https://www.youtube.com/embed/${sanitizedYoutubeVideoId}`}
      title={props.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      loading="lazy"
    />
  )
}

YoutubeVideo.defaultProps = {
  title: 'Embedded video',
}
