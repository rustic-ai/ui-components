import '../../index.css'

import DOMPurify from 'dompurify'
import React from 'react'

import { getSizeStyles } from '../helper'

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

/** > **Deprecated:** Use `Video` component instead. This component will be removed in the next release.
 *
 * The `YoutubeVideo` component enables the embedding of YouTube videos, providing a seamless playback experience.
 *
 * Note: `dompurify` is not bundled, so please install the following package using npm:
 *
 * ```typescript
 * npm i dompurify
 * ```
 */
export default function YoutubeVideo({
  title = 'Embedded video',
  ...props
}: YoutubeVideoProps) {
  const sanitizedYoutubeVideoId = DOMPurify.sanitize(props.youtubeVideoId)

  return (
    <iframe
      {...getSizeStyles(props.width, props.height)}
      data-cy="youtube-video-iframe"
      src={`https://www.youtube.com/embed/${sanitizedYoutubeVideoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      loading="lazy"
    />
  )
}
