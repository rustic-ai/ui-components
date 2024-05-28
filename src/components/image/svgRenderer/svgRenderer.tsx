import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import DOMPurify from 'dompurify'
import React from 'react'

import type { SvgFormat } from '../../types'

export default function SvgRenderer(props: SvgFormat) {
  const sanitizedCode = DOMPurify.sanitize(props.code)

  return (
    <Stack spacing={1}>
      {(props.title || props.description) && (
        <Box>
          {props.title && (
            <Typography variant="subtitle2">{props.title}</Typography>
          )}

          {props.description && (
            <Typography variant="caption">{props.description}</Typography>
          )}
        </Box>
      )}

      <div dangerouslySetInnerHTML={{ __html: sanitizedCode }} />
    </Stack>
  )
}
