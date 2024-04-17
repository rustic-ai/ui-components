import { supportedViewports } from '../../../cypress/support/variables'
import Input from './input'
import { onFileAddSuccess, onFileDelete } from './mockFunctions'
describe('Input', () => {
  const textInput = '[data-cy=text-input]'
  const sendButton = '[data-cy=send-button]'
  const uploadButton = '[data-cy=upload-button]'
  const fileName = '[data-cy=file-name]'

  const message = 'Hello, Cypress!'

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

    it(`can upload files on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('input[type=file]').selectFile(
        'public/images/image-component-example.png',
        {
          force: true,
        }
      )
      cy.get(fileName).should('contain', 'image-compon...')
    })
  })
})
