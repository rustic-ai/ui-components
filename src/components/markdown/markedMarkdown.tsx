import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import React from 'react'
import { useEffect, useState } from 'react'

import type { TextData } from '../types'

export function convertMarkdownToHtml(text: string): string {
  const textWithoutZeroWidthSpaces = text.replace(/^[\u200B-\u200F\uFEFF]/, '')
  const parsedText = marked.parse(textWithoutZeroWidthSpaces)
  const sanitizedText = DOMPurify.sanitize(parsedText)

  return sanitizedText
}

const MarkedMarkdown = (props: TextData) => {
  const [html, setHtml] = useState(convertMarkdownToHtml(props.text))

  useEffect(() => {
    if (props.updatedData && props.updatedData.length > 0) {
      const lastUpdatedData =
        props.updatedData[props.updatedData.length - 1].text
      setHtml(convertMarkdownToHtml(lastUpdatedData))
    }
  }, [props.text, props.updatedData])

  return (
    <Typography variant="body2" dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default MarkedMarkdown
