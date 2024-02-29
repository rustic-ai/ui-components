import './text.css'

import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import React from 'react'

import type { TextProps } from '../types'

const Text = (props: TextProps) => {
  return (
    <Typography variant="body2" className="rustic-text">
      {DOMPurify.sanitize(props.text)}
    </Typography>
  )
}

export default Text
