import { supportedViewports } from '../../../cypress/support/variables'
import Input, { type FileInfo } from './input'
import { delayReject, onFileAddSuccess, onFileDelete } from './mockFunctions'

function onFileAddFailed(
  file: File,
  fileId: string,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
  fileInfo: FileInfo
): Promise<{ url: string }> {
  return delayReject(1, fileInfo.controller.signal)
}

describe('Input', () => {
  const textInput = '[data-cy=text-input]'
  const sendButton = '[data-cy=send-button]'
  const uploadButton = '[data-cy=upload-button]'
  const fileName = '[data-cy=file-name]'
  const deleteButton = '[data-cy=delete-button]'
  const loadingProgress = '[data-cy=loading-progress]'
  const errorMessage = '[data-cy=error-message]'

  const message = 'Hello, Cypress!'
  const spaces = '   '
  const imageFile = 'public/images/image-component-example.png'
  const pdfFile = 'public/files/pdfExample.pdf'
  const videoFile = 'public/videoExamples/videoCaptions.mp4'

  const oneSecond = 1000
  beforeEach(() => {
    const mockWsClient = {
      send: cy.stub(),
      close: cy.stub(),
      reconnect: cy.stub(),
    }

    cy.mount(
      <Input
        sender="client"
        conversationId="1"
        ws={mockWsClient}
        label="Type you message"
        onFileAdd={onFileAddSuccess}
        onFileDelete={onFileDelete}
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`should render the TextInput component on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textInput).should('exist')
      cy.get(sendButton).should('exist')
      cy.get(uploadButton).should('exist')
    })

    it(`should have the send button enabled when the text input is not empty on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textInput).type(message)
      cy.get(textInput).get('textarea').invoke('val').should('equal', message)
      cy.get(sendButton).should('be.enabled')
    })

    it(`should have the send button disabled when the text input is empty and no file is added on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textInput).find('textarea').invoke('val').should('equal', '')
      cy.get(fileName).should('not.exist')
      cy.get(sendButton).should('be.disabled')
    })

    it(`should have the button disabled when the text input only contains spaces on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textInput).type(spaces)
      cy.get(textInput).get('textarea').invoke('val').should('equal', spaces)
      cy.get(sendButton).should('be.disabled')
    })

    it(`should not send the message when the text input only contains spaces and pressing enter on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textInput).type(spaces)
      cy.get(textInput).find('textarea').invoke('val').should('equal', spaces)

      cy.get(textInput).type('{enter}')
      cy.get(textInput).find('textarea').invoke('val').should('equal', spaces)
    })

    it(`should have the button disabled when the text input only contains linebreaks (shift+enter) on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textInput).type('{shift}{enter}')
      cy.get(textInput).find('textarea').invoke('val').should('equal', '\n')
      cy.get(sendButton).should('be.disabled')
    })

    it(`should send the message when pressing enter on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textInput).type(message)
      cy.get(textInput).get('textarea').invoke('val').should('equal', message)
      cy.get(textInput).type('{enter}')
      cy.get(textInput)
        .get('textarea')
        .first()
        .invoke('val')
        .should('equal', '')
    })

    it(`can add and delete files on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('input[type=file]').selectFile([imageFile, pdfFile, videoFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(fileName).should('contain', 'pdfExample.pdf')
      cy.get(fileName).should('contain', 'videoCaption...')
      cy.get(deleteButton).first().click()
      cy.get(fileName).should('not.contain', 'image-compon...')
      cy.get(fileName).should('contain', 'pdfExample.pdf')
      cy.get(fileName).should('contain', 'videoCaption...')
    })

    it(`should disable the send button while the file is loading on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textInput).type(message)
      cy.get(sendButton).should('not.be.disabled')
      cy.get('input[type=file]').selectFile([imageFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(loadingProgress).should('exist')
      cy.get(sendButton).should('be.disabled')
      cy.wait(oneSecond)
      cy.get(loadingProgress).should('not.exist')
      cy.get(sendButton).should('not.be.disabled').click()
      cy.get(sendButton).should('be.disabled')
      cy.get(fileName).should('not.exist')
    })

    it(`can only allow people to upload up to the specified maximum file count if maxFileCount props is available on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <Input
          sender="client"
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          label="Type you message"
          onFileAdd={onFileAddSuccess}
          onFileDelete={onFileDelete}
          maxFileCount={2}
        />
      )

      //try to add 3 files when the max file count is 2
      cy.get('input[type=file]').selectFile([imageFile, pdfFile, videoFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(fileName).should('contain', 'pdfExample.pdf')
      cy.get(fileName).should('not.contain', 'videoCaption...')
      cy.get(errorMessage).should(
        'contain',
        'You can only upload up to 2 files'
      )

      //remove 1 file
      cy.get(deleteButton).last().click()
      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(fileName).should('not.contain', 'pdfExample.pdf')
      cy.get(errorMessage).should('not.exist')

      //add a new file
      cy.get('input[type=file]').selectFile([videoFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(fileName).should('contain', 'videoCaption...')
    })

    it(`should only accept certain file types if acceptedFileTypes props is available on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <Input
          sender="client"
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          label="Type you message"
          onFileAdd={onFileAddSuccess}
          onFileDelete={onFileDelete}
          acceptedFileTypes="image/*"
        />
      )
      cy.get('input[type=file]').should('have.attr', 'accept', 'image/*')
    })

    it(`should not allow adding files which exceeds the maximum file size on ${viewport} screen`, () => {
      const oneKb = 1024
      const fiveHundred = 500
      cy.viewport(viewport)
      cy.mount(
        <Input
          sender="client"
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          label="Type you message"
          onFileAdd={onFileAddSuccess}
          onFileDelete={onFileDelete}
          maxFileSize={fiveHundred * oneKb}
        />
      )

      cy.get('input[type=file]').selectFile([imageFile, pdfFile, videoFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(fileName).should('contain', 'pdfExample.pdf')
      cy.get(fileName).should('not.contain', 'videoCaption...')
      cy.get(errorMessage).should(
        'contain',
        'Failed to upload videoCaptions.mp4. You cannot upload files larger than 500 KB.'
      )
    })

    it(`shows an error message if the file is failed to upload on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <Input
          sender="client"
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          label="Type you message"
          onFileAdd={onFileAddFailed}
          onFileDelete={onFileDelete}
        />
      )

      cy.get('input[type=file]').selectFile(imageFile, {
        force: true,
      })
      cy.get(errorMessage).should(
        'contain',
        'Failed to upload image-component-example.png.'
      )
      cy.get(fileName).should('not.exist')
    })
  })
})
