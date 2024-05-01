import Multipart from './multipart'

const meta = {
  title: 'Rustic UI/Multipart/Multipart',
  component: Multipart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `Multipart` component is a versatile message format designed to accommodate both textual content and file attachments within a single message interface.',
      },
    },
  },
}

export default meta

const fileList = [
  'file1.pdf',
  'file2.doc',
  'file3.docx',
  'file4.png',
  'file5.jpg',
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
