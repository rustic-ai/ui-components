import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import React from 'react'

export interface ImageProps {
  /** Path to the image source. */
  url: string
  /** Width rendered in pixels. */
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

  return (
    <>
      {isLoading && <CircularProgress data-cy="spinner" />}
      <img
        src={props.url}
        alt={props.alt}
        width={props.width}
        height={props.height}
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
  width: 200,
  height: 200,
}
