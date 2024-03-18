import './text.css'

import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import React from 'react'

import type { TextData } from '../types'

const Text = (props: TextData) => {
  return (
    <Typography variant="body2" className="rustic-text">
      {DOMPurify.sanitize(props.text)}
    </Typography>
  )
}

export default Text
