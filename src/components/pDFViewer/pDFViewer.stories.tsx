import Button from '@mui/material/Button'
import React, { useState } from 'react'

import PDFViewer from './pDFViewer'
export default {
  title: 'Rustic UI/PDF Viewer/PDF Viewer',
  component: PDFViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The PDFViewer component is designed to display PDF documents seamlessly within a web application. It offers an intuitive user interface for navigating through pages.',
      },
    },
  },
}

export const Default = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setIsOpen(true)}
      >
        Open PDF
      </Button>
      {isOpen && (
        <PDFViewer
          url="files/pdfExample.pdf"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export const Error = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => setIsOpen(true)}
      >
        Open PDF
      </Button>
      {isOpen && (
        <PDFViewer
          url="wrongUrl.pdf"
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
