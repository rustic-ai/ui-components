import './multipart.css'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import React from 'react'

import { shortenString } from '../helper'
import Text from '../text/text'
import type { MultipartData } from '../types'

export default function Multipart(props: MultipartData) {
  const maximumFileNameLength = 15

  function renderFiles() {
    const files = props.files.map((file, index) => {
      return (
        <Card
          className="rustic-file-preview"
          key={index}
          data-cy="file-preview"
        >
          <Typography variant="subtitle2" data-cy="file-name">
            {shortenString(file, maximumFileNameLength)}
          </Typography>
        </Card>
      )
    })
    return <Box className="rustic-files">{files}</Box>
  }

  return (
    <Box className="rustic-multipart">
      {props.text && <Text text={props.text} />}
      {renderFiles()}
    </Box>
  )
}
