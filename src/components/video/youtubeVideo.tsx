import './youtubeVideo.css'

import CircularProgress from '@mui/material/CircularProgress'
import { Box } from '@mui/system'
import DOMPurify from 'dompurify'
import { useState } from 'react'
import React from 'react'

export interface YoutubeVideoProps {
  /** The string after "?v=" parameter of YoutTube URLs. */
  youtubeVideoId: string
  /** Height rendered in pixels. */
  height?: number
  /** Width rendered in pixels. */
  width?: number
  /** Title of the video used for assistive technology. */
  title?: string
}

export default function YoutubeVideo(props: YoutubeVideoProps) {
  const [isLoading, setIsLoading] = useState(true)

  const sanitizedYoutubeVideoId = DOMPurify.sanitize(props.youtubeVideoId)

  function handleLoad(): void {
    setIsLoading(false)
  }

  return (
    <Box className="rustic-youtube-video">
      {isLoading && (
        <Box className="rustic-youtube-video-loading-container">
          <CircularProgress data-cy="spinner" />
        </Box>
      )}
      <iframe
        data-cy="youtube-video-iframe"
        height={props.height}
        width={props.width}
        src={`https://www.youtube.com/embed/${sanitizedYoutubeVideoId}`}
        title={props.title}
        onLoad={handleLoad}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        loading="lazy"
      />
    </Box>
  )
}

YoutubeVideo.defaultProps = {
  height: 300,
  width: 400,
  title: 'Embedded video',
}
