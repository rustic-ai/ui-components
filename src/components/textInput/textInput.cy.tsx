import TextInput from './textInput'

describe('TextInput', () => {
  beforeEach(() => {
    const mockWsClient = {
      send: cy.stub(),
      close: cy.stub(),
      reconnect: cy.stub(),
    }

    cy.mount(
      <TextInput
        sender="client"
        conversationId="1"
        ws={mockWsClient}
        label="Type you message"
      />
    )
  })

  const textInput = '[data-cy=text-input]'
  const sendButton = '[data-cy=send-button]'
  const message = 'Hello, Cypress!'
  const spaces = '     '

  it('should render the TextInput component', () => {
    cy.get(textInput).should('exist')
    cy.get(sendButton).should('exist')
  })

  it('should have the send button enabled when the text input is not empty', () => {
    cy.get(textInput).type(message)
    cy.get(textInput).get('textarea').invoke('val').should('equal', message)
    cy.get(sendButton).should('be.enabled')
  })

  it('should have the send button disabled when the text input is empty', () => {
    cy.get(textInput).find('textarea').invoke('val').should('equal', '')
    cy.get(sendButton).should('be.disabled')
  })

  it('should have the button disabled when the text input only contains spaces', () => {
    cy.get(textInput).type(spaces)
    cy.get(textInput).get('textarea').invoke('val').should('equal', spaces)
    cy.get(sendButton).should('be.disabled')
  })

  it('should not send the message when the text input only contains spaces and pressing enter', () => {
    cy.get(textInput).type(spaces)
    cy.get(textInput).find('textarea').invoke('val').should('equal', spaces)
    cy.get(textInput).type('{enter}')
    cy.get(textInput).find('textarea').invoke('val').should('equal', spaces)
  })

  it('should have the button disabled when the text input only contains linebreaks (shift+enter)', () => {
    cy.get(textInput).type('{shift}{enter}')
    cy.get(textInput).find('textarea').invoke('val').should('equal', '\n')
    cy.get(sendButton).should('be.disabled')
  })

  it('should send the message when pressing enter', () => {
    cy.get(textInput).type(message)
    cy.get(textInput).get('textarea').invoke('val').should('equal', message)
    cy.get(textInput).type('{enter}')
    cy.get(textInput).get('textarea').first().invoke('val').should('equal', '')
  })
})
