import './pDFViewer.css'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import * as pdfjsLib from 'pdfjs-dist'
import React, { useEffect, useRef, useState } from 'react'

import Icon from '../icon/icon'

type PDFViewerProps = {
  url: string
}

function PDFViewer(props: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pageInput, setPageInput] = useState('1')
  const [isOpen, setIsOpen] = useState(true)
  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`

    pdfjsLib
      .getDocument({
        url: `${props.url}`,
      })
      .promise.then((pdf) => {
        setTotalPages(pdf.numPages)

        const canvas = canvasRef.current
        if (!canvas) {
          return
        }

        const context = canvas.getContext('2d')
        if (!context) {
          return
        }

        pdf.getPage(currentPage).then((page) => {
          const viewport = page.getViewport({ scale: 10 })

          // Set the canvas size to the scaled viewport dimensions
          canvas.height = viewport.height
          canvas.width = viewport.width

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          }
          page.render(renderContext)
        })
      })
      .catch((error) => {
        console.error('Error loading PDF:', error)
      })
  }, [props.url, currentPage])

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

  if (isOpen) {
    return (
      <Box className="rustic-pdf-viewer">
        <Box className="rustic-pdf-viewer-header">
          <Typography variant="body1" className="rustic-page-indicator">
            Page
            <TextField
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              size="small"
              className="rustic-pdf-page-input"
            />
            of {totalPages}
          </Typography>
          <IconButton onClick={goToPreviousPage} disabled={currentPage === 1}>
            <Icon name="arrow_back" />
          </IconButton>
          <IconButton
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <Icon name="arrow_forward" />
          </IconButton>
          <IconButton
            onClick={() => setIsOpen(false)}
            className="rustic-close-button"
          >
            <Icon name="close" />
          </IconButton>
        </Box>
        <Box className="rustic-pdf-viewer-body">
          <canvas ref={canvasRef} />
        </Box>
      </Box>
    )
  }
}

export default PDFViewer
