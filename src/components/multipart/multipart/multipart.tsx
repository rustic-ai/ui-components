import '../../../index.css'
import './multipart.css'

import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import React from 'react'

import FilePreview from '../../filePreview/filePreview'
import Icon from '../../icon/icon'
import MarkedMarkdown from '../../markdown'
import type { MultipartProps } from '../../types'

/** The `Multipart` component is a versatile message format designed to accommodate both textual content and file attachments within a single message interface. */
export default function Multipart(props: MultipartProps) {
  function renderFiles() {
    const files = props.files.map((file, index) => {
      return (
        <FilePreview
          file={file}
          showFullName={props.showFullName}
          getAuthHeaders={props.getAuthHeaders}
          key={index}
        >
          {file.url && (
            <Tooltip title="Download" className="rustic-shift-to-right-by-8">
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
      {(props.title || props.description) && (
        <div>
          {props.title && <Typography variant="h6">{props.title}</Typography>}
          {props.description && <MarkedMarkdown text={props.description} />}
        </div>
      )}
      {props.text && <MarkedMarkdown text={props.text} />}
      {renderFiles()}
    </Box>
  )
}
