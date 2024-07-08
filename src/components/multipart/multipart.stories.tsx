import Multipart from './multipart'

const meta = {
  title: 'Rustic UI/Multipart/Multipart',
  component: Multipart,
  tags: ['autodocs'],
  argTypes: {
    files: {
      table: {
        type: {
          summary: 'An array of FileData.\n',
          detail:
            'Each FileData has the following fields:\n' +
            '  name: The name of the file.\n' +
            '  url: Optional string of the file url. \n',
        },
      },
    },
  },
}

export default meta

const fileList = [
  { name: 'File1.pdf' },
  { name: 'File2.doc' },
  { name: 'File3.docx' },
  { name: 'File4.png' },
  { name: 'File5.jpg' },
]

export const Default = {
  args: {
    text: 'This is a multipart message with text',
    files: fileList,
  },
}

export const FilesOnly = {
  args: {
    files: fileList,
  },
}

export const FileWithURL = {
  args: {
    files: [
      {
        name: 'pdfExample.pdf',
        url: 'files/pdfExample.pdf',
      },
    ],
  },
}
