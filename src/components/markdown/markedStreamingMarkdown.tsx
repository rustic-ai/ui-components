import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useEffect, useState } from 'react'

import type { UpdateableText } from '../types'
import { convertMarkdownToHtml } from './markedMarkdown'

const MarkedStreamingMarkdown = (props: UpdateableText) => {
  const [html, setHtml] = useState(convertMarkdownToHtml(props.text))
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
        } else {
          newData += data.text
        }
      }

      setHtml(convertMarkdownToHtml(newData))
    }
  }, [props.text, props.updatedData])

  return (
    <>
      <Typography variant="body2" dangerouslySetInnerHTML={{ __html: html }} />
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
    </>
  )
}

export default MarkedStreamingMarkdown
