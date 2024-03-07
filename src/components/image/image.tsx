import './image.css'

import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import React from 'react'

export interface ImageProps {
  /** Path to the image source. */
  url: string
  /** Width rendered in pixels. If neither width nor height are provided, the image will be set to be contained in the parent container. */
  width?: number
  /** Height rendered in pixels. */
  height?: number
  /** Alternative text for the image used for assistive technology. */
  alt?: string
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

  let stylingAttributes = {}

  if (props.width) {
    stylingAttributes = {
      width: props.width,
    }
  }
  if (props.height) {
    stylingAttributes = {
      ...stylingAttributes,
      height: props.height,
    }
  }
  if (!props.width && !props.height) {
    stylingAttributes = {
      className: 'rustic-image-responsive',
    }
  }

  return (
    <>
      {isLoading && <CircularProgress data-cy="spinner" />}
      <img
        {...stylingAttributes}
        src={props.url}
        alt={props.alt}
        onError={handleImageError}
        onLoad={() => {
          setIsLoading(false)
        }}
      />
    </>
  )
}

Image.defaultProps = {
  alt: 'An image is displayed',
}
