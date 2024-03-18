import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import { useEffect, useState } from 'react'
import React from 'react'

import type { TextData } from '../types'

const StreamingText = (props: TextData) => {
  const [text, setText] = useState(DOMPurify.sanitize(props.text))
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (props.updatedData && props.updatedData.length > 0) {
      let newData = props.text
      for (const data of props.updatedData) {
        if (typeof data.text !== 'string') {
          newData += ' [MISSING TEXT]'

          setErrorMessage(
            'Some of the incoming text was not correctly formatted. Some data may be missing.'
          )
        }

        newData += data.text
      }

      setText(DOMPurify.sanitize(newData))
    }
  }, [props.text, props.updatedData])

  return (
    <>
      <Typography data-cy="streaming-text" variant="body2">
        {text}
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </>
  )
}

export default StreamingText
