import { supportedViewports } from '../../../../cypress/support/variables'
import TextInput from './textInput'

describe('TextInput', () => {
  const textField = '[data-cy=text-field]'
  const sendButton = '[data-cy=send-button]'
  const message = 'Hello, Cypress!'
  const spaces = '     '
  const recordButton = '[data-cy=record-button]'

  context('Regular', () => {
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
          label="Type your message"
        />
      )
    })

    supportedViewports.forEach((viewport) => {
      it(`should render the TextInput component on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(textField).should('exist')
        cy.get(sendButton).should('exist')
      })

      it(`should have the send button enabled when the text input is not empty on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(textField).type(message)
        cy.get(textField).get('textarea').invoke('val').should('equal', message)
        cy.get(sendButton).should('be.enabled')
      })

      it(`should have the send button disabled when the text input is empty on ${viewport} screen`, () => {
        cy.viewport(viewport)
        cy.get(textField).find('textarea').invoke('val').should('equal', '')
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
    })
  })

  context('Speech-to-text', () => {
    beforeEach(() => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.window().then((win) => {
        cy.stub(win, 'webkitSpeechRecognition').returns({
          lang: 'en-US',
          start: cy.stub().as('startStub'),
          stop: cy.stub().as('stopStub'),
          onerror: cy.stub().as('errorStub'),
        })
      })

      cy.mount(
        <TextInput
          sender="client"
          conversationId="1"
          ws={mockWsClient}
          label="Type your message"
          enableSpeechToText={true}
        />
      )
    })

    supportedViewports.forEach((viewport) => {
      it(`should start and stop speech recognition on ${viewport} screen`, () => {
        cy.viewport(viewport)
        // verify speech recognition has not started initially
        cy.get(recordButton).click()

        // verify speech recognition started
        cy.get('@startStub').should('be.called')

        cy.get(recordButton).click()
        cy.get('@stopStub').should('be.called')
        cy.get('[data-cy=spinner]').should('exist')
        cy.window().then((win) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const recognition: any = new win.webkitSpeechRecognition()
          recognition.onend()
        })
        cy.get('[data-cy=spinner]').should('not.exist')
      })
      it(`should add recorded results to text input on ${viewport} screen`, () => {
        cy.viewport(viewport)

        cy.get(recordButton).click()

        const mockEvent = {
          results: [[{ transcript: message }]],
        }

        cy.window().then((win) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const recognition: any = new win.webkitSpeechRecognition()
          recognition.onresult(mockEvent)
        })

        cy.get(`${textField} textarea`).should('have.value', message)
      })
    })
  })
})
