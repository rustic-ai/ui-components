import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import Icon from '../icon/icon'
import type { GetAuthHeaders } from '../types'

type DownloadButtonProps = {
  url: string
  fileName: string
  getAuthHeaders?: GetAuthHeaders
}

export default function DownloadButton(props: DownloadButtonProps) {
  function handleAuthenticatedDownload() {
    props.getAuthHeaders!()
      .then((headersObj: Record<string, any>) => {
        const headers = headersObj.headers
        return fetch(props.url, { headers })
      })
      .then((response) => {
        return response.blob()
      })
      .then((blob) => {
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = props.fileName
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
      })
  }

  return (
    <Tooltip title="Download" className="rustic-shift-to-right-by-8">
      {props.getAuthHeaders ? (
        <IconButton
          onClick={handleAuthenticatedDownload}
          data-cy="download-button"
        >
          <Icon name="download" />
        </IconButton>
      ) : (
        <IconButton
          component="a"
          href={props.url}
          download={props.fileName}
          data-cy="download-button"
        >
          <Icon name="download" />
        </IconButton>
      )}
    </Tooltip>
  )
}
