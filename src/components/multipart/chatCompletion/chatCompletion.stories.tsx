import ChatCompletion from './chatCompletion'

export default {
  title: 'Rustic UI/Multipart/ChatCompletion',
  component: ChatCompletion,
  tags: ['autodocs'],
}

export const Default = {
  args: {
    messages: [
      {
        content: [
          {
            type: 'text',
            text: 'textual content',
          },
          {
            type: 'image_url',
            image_url: {
              url: `${window.location.origin}/images/image-component-example.png`,
            },
          },
          {
            type: 'file_url',
            file_url: {
              url: `${window.location.origin}/files/pdfExample.pdf`,
            },
          },
        ],
        role: 'user',
      },
    ],
  },
}
