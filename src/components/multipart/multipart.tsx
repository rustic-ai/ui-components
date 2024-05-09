import '../../index.css'
import './multipart.css'

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/system/Box'
import React from 'react'

import FilePreview from '../filePreview/filePreview'
import Icon from '../icon'
import Text from '../text/text'
import type { MultipartData } from '../types'

export default function Multipart(props: MultipartData) {
  function renderFiles() {
    const files = props.files.map((file, index) => {
      return (
        <FilePreview file={file} key={index}>
          {file.url && (
            <Tooltip title="Download">
              <IconButton
                component="a"
                href={file.url}
                download={file.name}
                data-cy="download-button"
              >
                <Icon name="download" />
              </IconButton>
            </Tooltip>
          )}
        </FilePreview>
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
