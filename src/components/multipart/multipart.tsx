import '../../index.css'
import './multipart.css'

import Box from '@mui/system/Box'
import React from 'react'

import FilePreview from '../filePreview/filePreview'
import Text from '../text/text'
import type { MultipartData } from '../types'

export default function Multipart(props: MultipartData) {
  function renderFiles() {
    const files = props.files.map((file, index) => {
      return <FilePreview file={file} key={index} />
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
