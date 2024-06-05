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
          'The PDFViewer component is designed to display PDF documents seamlessly within a web application. It offers an intuitive user interface for navigating through pages',
      },
    },
  },
}

export const Default = {
  args: {
    url: 'files/pdfExample.pdf',
  },
}
