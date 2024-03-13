import './image.css'
import '../../index.css'

import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import React from 'react'

import { getSizeStyles } from '../helper'

export interface ImageProps {
  /** Path to the image source. */
  url: string
  /** Width rendered in pixels. If neither width nor height are provided, the image will be set to be contained in the parent container. */
  width?: number
  /** Height rendered in pixels. */
  height?: number
  /** Alternative text for the image used for assistive technology. */
  alt?: string
  /** Description of the image. */
  description?: string
}

export default function Image(props: ImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>('')

  function handleImageError(): void {
    setErrorMessage('Image failed to load')
    setIsLoading(false)
  }

  if (errorMessage.length > 0) {
    return <Typography variant="body2">{errorMessage}</Typography>
  }

  return (
    <figure>
      {isLoading && <CircularProgress data-cy="spinner" />}
      <img
        {...getSizeStyles(props.width, props.height)}
        src={props.url}
        alt={props.alt}
        onError={handleImageError}
        onLoad={() => {
          setIsLoading(false)
        }}
      />
      {props.description && (
        <figcaption>
          <Typography variant="body2">{props.description}</Typography>
        </figcaption>
      )}
    </figure>
  )
}

Image.defaultProps = {
  alt: 'An image is displayed',
}
