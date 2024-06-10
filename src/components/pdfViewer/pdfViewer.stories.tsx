import type { StoryFn } from '@storybook/react'
import React from 'react'

import PDFViewer from './pdfViewer'
export default {
  title: 'Rustic UI/PDF Viewer/PDF Viewer',
  component: PDFViewer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

export const Default = {
  args: {
    url: 'files/pdfExample.pdf',
  },
  decorators: [
    (Story: StoryFn) => {
      return (
        <div
          style={{
            width: 'clamp(250px, 90vw, 900px)',
            height: 'clamp(150px, 90vh, 800px)',
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export const Error = {
  args: {
    url: 'wrongUrl.pdf',
  },
}
