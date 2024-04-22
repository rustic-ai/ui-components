import 'cypress-real-events'

import { supportedViewports } from '../../../../../cypress/support/variables'
import MultimodalInput from './multimodalInput'

describe('Input', () => {
  const textField = '[data-cy=text-field]'
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

  beforeEach(() => {
    const mockWsClient = {
      send: cy.stub(),
      close: cy.stub(),
      reconnect: cy.stub(),
    }

    cy.mount(
      <MultimodalInput
        sender="client"
        conversationId="1"
        ws={mockWsClient}
        label="Type you message"
        uploadFileEndpoint={'/upload/'}
        deleteFileEndpoint={'/delete/'}
        acceptedFileTypes={''}
        maxFileCount={5}
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`should render the TextInput component on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).should('exist')
      cy.get(sendButton).should('exist')
      cy.get(uploadButton).should('exist')
    })

    it(`should have the send button enabled when the text input is not empty on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type(message)
      cy.get(textField).get('textarea').invoke('val').should('equal', message)
      cy.get(sendButton).should('be.enabled')
    })

    it(`should have the send button disabled when the text input is empty and no file is added on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).find('textarea').invoke('val').should('equal', '')
      cy.get(fileName).should('not.exist')
      cy.get(sendButton).should('be.disabled')
    })

    it(`should have the button disabled when the text input only contains spaces on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type(spaces)
      cy.get(textField).get('textarea').invoke('val').should('equal', spaces)
      cy.get(sendButton).should('be.disabled')
    })

    it(`should not send the message when the text input only contains spaces and pressing enter on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type(spaces)
      cy.get(textField).find('textarea').invoke('val').should('equal', spaces)

      cy.get(textField).type('{enter}')
      cy.get(textField).find('textarea').invoke('val').should('equal', spaces)
    })

    it(`should have the button disabled when the text input only contains linebreaks (shift+enter) on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type('{shift}{enter}')
      cy.get(textField).find('textarea').invoke('val').should('equal', '\n')
      cy.get(sendButton).should('be.disabled')
    })

    it(`should send the message when pressing enter on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type(message)
      cy.get(textField).get('textarea').invoke('val').should('equal', message)
      cy.get(textField).type('{enter}')
      cy.get(textField)
        .get('textarea')
        .first()
        .invoke('val')
        .should('equal', '')
    })

    it(`can add and delete files on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.intercept(
        {
          method: 'POST',
          url: '/upload/*',
        },
        { url: '' }
      ).as('upload')
      cy.get('input[type=file]').selectFile([imageFile, pdfFile, videoFile], {
        force: true,
      })

      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(fileName).should('contain', 'pdfExample.pdf')
      cy.get(fileName).should('contain', 'videoCaption...')
      cy.get(deleteButton).first().realClick()
      cy.get(fileName).should('not.contain', 'image-compon...')
      cy.get(fileName).should('contain', 'pdfExample.pdf')
      cy.get(fileName).should('contain', 'videoCaption...')
    })

    it(`allows adding the same file after deleting it on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.intercept(
        {
          method: 'POST',
          url: '/upload/*',
        },
        { url: '' }
      ).as('upload')
      cy.get('input[type=file]').selectFile([imageFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(deleteButton).click()
      cy.get(fileName).should('not.exist')
      cy.get('input[type=file]').selectFile([imageFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
    })

    it.skip(`should disable the send button while the file is loading on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(textField).type(message)
      cy.get(sendButton).should('not.be.disabled')
      cy.intercept(
        {
          method: 'POST',
          url: '/upload/*',
        },
        { url: '' }
      ).as('upload')
      cy.get('input[type=file]').selectFile([imageFile], {
        force: true,
      })
      cy.get(fileName).should('contain', 'image-compon...')
      cy.get(sendButton).should('be.disabled')
      cy.get(loadingProgress).should('exist')

      cy.wait('@upload').then(() => {
        cy.get(loadingProgress).should('not.exist')
        cy.get(sendButton).should('not.be.disabled').click()
        cy.get(sendButton).should('be.disabled')
        cy.get(fileName).should('not.exist')
      })
    })

    it(`can only allow people to upload up to the specified maximum file count if maxFileCount props is available on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <MultimodalInput
          sender="client"
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          label="Type you message"
          maxFileCount={2}
          acceptedFileTypes={''}
          uploadFileEndpoint={'/upload/'}
          deleteFileEndpoint={'/delete/'}
        />
      )
      cy.intercept(
        {
          method: 'POST',
          url: '/upload/*',
        },
        { url: '' }
      ).as('upload')

      //try to add 3 files when the max file count is 2
      cy.get('input[type=file]').selectFile([imageFile, pdfFile, videoFile], {
        force: true,
      })

      cy.wait('@upload').then(() => {
        cy.get(fileName).should('contain', 'image-compon...')
        cy.get(fileName).should('contain', 'pdfExample.pdf')
        cy.get(fileName).should('not.contain', 'videoCaption...')
        cy.get(errorMessage).should(
          'contain',
          'You can only upload up to 2 files'
        )

        //remove 1 file
        cy.get(deleteButton).last().realClick()

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
    })

    it(`should only accept certain file types if acceptedFileTypes props is available on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <MultimodalInput
          sender="client"
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          label="Type you message"
          uploadFileEndpoint={'/upload/'}
          deleteFileEndpoint={'/delete/'}
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
        <MultimodalInput
          sender="client"
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          label="Type you message"
          uploadFileEndpoint={'/upload/'}
          deleteFileEndpoint={'/delete/'}
          maxFileSize={fiveHundred * oneKb}
          acceptedFileTypes={''}
          maxFileCount={5}
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
        <MultimodalInput
          sender="client"
          conversationId="1"
          ws={{
            send: cy.stub(),
            close: cy.stub(),
            reconnect: cy.stub(),
          }}
          label="Type you message"
          uploadFileEndpoint={'/upload/'}
          deleteFileEndpoint={'/delete/'}
          acceptedFileTypes={''}
        />
      )

      cy.intercept(
        {
          method: 'POST',
          url: '/upload/*',
        },
        {
          statusCode: 500,
          body: { message: 'Please try again later' },
        }
      ).as('upload')
      cy.get('input[type=file]').selectFile(imageFile, {
        force: true,
      })
      cy.wait('@upload').then(() => {
        cy.get(errorMessage).should(
          'contain',
          'Failed to upload image-component-example.png. Please try again later'
        )
        cy.get(fileName).should('not.exist')
      })
    })
  })
})
