import './pDFViewer.css'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/system/useTheme'
import * as pdfjsLib from 'pdfjs-dist'
import React, { useEffect, useRef, useState } from 'react'

import Icon from '../icon/icon'
import type { PDFViewerProps } from '../types'

function PDFViewer(props: PDFViewerProps) {
  const pdfRef = useRef<HTMLCanvasElement | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageInput, setPageInput] = useState('1')
  const [hasError, setHasError] = useState<boolean>(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))

  function getDefaultScale() {
    const mobileDefaultScale = 0.5
    const tabletDefaultScale = 1.0
    const desktopDefaultScale = 1.5
    if (isMobile) {
      return mobileDefaultScale
    } else if (isTablet) {
      return tabletDefaultScale
    } else {
      return desktopDefaultScale
    }
  }
  const [scale, setScale] = useState(getDefaultScale)

  function renderPage(pdf: pdfjsLib.PDFDocumentProxy) {
    pdf.getPage(currentPage).then((page) => {
      const viewport = page.getViewport({ scale })
      const canvas = pdfRef.current
      if (!canvas) {
        return
      }
      const context = canvas.getContext('2d')
      if (!context) {
        return
      }

      const devicePixelRatio = window.devicePixelRatio || 1

      canvas.style.width = `${viewport.width}px`
      canvas.style.height = `${viewport.height}px`

      canvas.width = viewport.width * devicePixelRatio
      canvas.height = viewport.height * devicePixelRatio

      const transform = [devicePixelRatio, 0, 0, devicePixelRatio, 0, 0]

      const renderContext = {
        canvasContext: context,
        viewport,
        transform,
      }
      page.render(renderContext)
    })
  }

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`

    pdfjsLib
      .getDocument({ url: `${props.url}` })
      .promise.then((pdf) => {
        setTotalPages(pdf.numPages)
        renderPage(pdf)
      })
      .catch(() => {
        setHasError(true)
      })
  }, [props.url, currentPage, scale])

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setPageInput((currentPage - 1).toString())
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      setPageInput((currentPage + 1).toString())
    }
  }

  function handlePageInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setPageInput(value)

    const pageNumber = parseInt(value, 10)
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const zoomFactorChange = 0.2
  function zoomIn() {
    setScale((prevScale) => prevScale + zoomFactorChange)
  }

  function zoomOut() {
    setScale((prevScale) =>
      Math.max(prevScale - zoomFactorChange, zoomFactorChange)
    )
  }

  if (props.isOpen) {
    if (hasError) {
      return (
        <Modal
          open={props.isOpen}
          onClose={props.onClose}
          className="rustic-pdf-viewer-modal"
        >
          <Card variant="outlined" className="rustic-pdf-error">
            <Typography variant="body2">
              Failed to load the PDF file.
            </Typography>
          </Card>
        </Modal>
      )
    }

    return (
      <Modal
        open={props.isOpen}
        onClose={props.onClose}
        className="rustic-pdf-viewer-modal"
      >
        <Card variant="outlined" className="rustic-pdf-viewer">
          <Box className="rustic-pdf-viewer-header">
            <Typography
              variant="body1"
              className="rustic-page-indicator"
              data-cy="rustic-pdf-page-indicator"
            >
              Page
              <TextField
                type="text"
                value={pageInput}
                onChange={handlePageInputChange}
                size="small"
                className="rustic-pdf-page-input"
                data-cy="rustic-pdf-page-input"
              />
              of {totalPages}
            </Typography>

            <IconButton
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              data-cy="rustic-previous-page-button"
            >
              <Icon name="arrow_back" />
            </IconButton>
            <IconButton
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              data-cy="rustic-next-page-button"
            >
              <Icon name="arrow_forward" />
            </IconButton>
            <IconButton onClick={zoomOut} className="rustic-zoom-out-button">
              <Icon name="zoom_out" />
            </IconButton>
            <IconButton onClick={zoomIn} className="rustic-zoom-in-button">
              <Icon name="zoom_in" />
            </IconButton>
            <IconButton onClick={props.onClose} className="rustic-close-button">
              <Icon name="close" />
            </IconButton>
          </Box>

          <Box className="rustic-pdf-viewer-body">
            <canvas ref={pdfRef} data-cy="rustic-pdf-canvas" />
          </Box>
        </Card>
      </Modal>
    )
  }
}

export default PDFViewer
