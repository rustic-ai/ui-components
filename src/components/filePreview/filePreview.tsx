import './filePreview.css'

import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'

import { shortenString } from '../helper'
import Icon from '../icon/icon'
import PDFViewer from '../pdfViewer/pdfViewer'
import type { FileData } from '../types'

export interface FilePreviewProps {
  file: FileData
}

export default function FilePreview(
  props: React.PropsWithChildren<FilePreviewProps>
) {
  const theme = useTheme()
  const maximumFileNameLength = 15

  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleFileClick() {
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
  }

  const isPdfFile =
    props.file.url && props.file.url.toLowerCase().endsWith('.pdf')

  return (
    <>
      <Card
        className={`rustic-file-preview${isPdfFile ? ' rustic-cursor-pointer' : ''}`}
        data-cy="file-preview"
        variant="outlined"
        sx={{ boxShadow: theme.shadows[1] }}
        onClick={handleFileClick}
      >
        <Typography variant="subtitle2" data-cy="file-name">
          {shortenString(props.file.name, maximumFileNameLength)}
        </Typography>
        <div onClick={(e) => e.stopPropagation()}>{props.children}</div>
      </Card>
      {isPdfFile && (
        <Modal
          open={isModalOpen}
          onClose={handleCloseModal}
          className="rustic-pdf-viewer-modal"
        >
          <div className="rustic-pdf-viewer-container">
            <Tooltip title="Close">
              <IconButton
                onClick={handleCloseModal}
                className="rustic-close-button"
                data-cy="pdf-viewer-close-button"
              >
                <Icon name="close" />
              </IconButton>
            </Tooltip>
            {props.file.url && <PDFViewer url={props.file.url} />}
          </div>
        </Modal>
      )}
    </>
  )
}
