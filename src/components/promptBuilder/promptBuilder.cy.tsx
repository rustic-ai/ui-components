import { Server } from 'mock-socket'

import Question from '../question/question'
import { getMockWebSocketClient, sendMessageToClient } from './mockWebSocket'
import PromptBuilder from './promptBuilder'

const webSocketUrl = 'ws://localhost:8081'
const server = new Server(webSocketUrl)

server.on('connection', (socket) => {
  sendMessageToClient(socket, 'question', {
    title: 'What is your main goal?',
    options: [
      'grow my business',
      'sell internationally',
      'hire or train employees',
    ],
  })

  socket.on('message', () => {
    sendMessageToClient(socket, 'promptBuilder', {
      isLastQuestion: true,
    })
  })
})

describe('PromptBuilder Component', () => {
  const promptBuilder = '[data-cy=prompt-builder]'
  const componentTitle = '[data-cy=component-title]'
  const quitButton = '[data-cy=quit-button]'
  const quitDialogTitle = '[data-cy=quit-dialog-title]'
  const confirmQuitButton = '[data-cy=confirm-quit-button]'
  const continueBuildButton = '[data-cy=continue-build-button]'
  const nextQuestionButton = '[data-cy=next-question-button]'
  const questionsButtonsContainer = '[data-cy=buttons-container]'
  const loadingSpinner = '[data-cy=loading-spinner]'
  const generateButton = '[data-cy=generate-button]'
  const mockProps = {
    sender: { name: 'user', id: '1234' },
    messageId: '123',
    supportedElements: { question: Question },
  }
  beforeEach(() => {
    const stubbedFunctions = {
      onCancel: cy.stub().as('onCancel'),
      onSubmit: cy.stub().as('onSubmit'),
      ws: getMockWebSocketClient(webSocketUrl),
    }
    cy.mount(<PromptBuilder {...mockProps} {...stubbedFunctions} />)
  })
  it('renders the component', () => {
    cy.get(promptBuilder).should('be.visible')
    cy.get(componentTitle).should('be.visible')
    cy.get(quitButton).should('be.visible')
    cy.get(nextQuestionButton).should('be.visible')
  })
  it('shows quit dialog when attempting to quit', () => {
    cy.get(quitButton).click()
    cy.get(quitDialogTitle).should('be.visible')
  })
  it('executes onClose when the user quits', () => {
    cy.get(quitButton).click()
    cy.get(confirmQuitButton).click()
    cy.get('@onCancel').should('be.called')
  })
  it('does not quit when the user clicks "Continue build"', () => {
    cy.get(quitButton).click()
    cy.get(continueBuildButton).click()
    cy.get(quitDialogTitle).should('not.be.visible')
    cy.get(promptBuilder).should('be.visible')
  })
  it('should disable the "Next question" button when the user has not selected an option', () => {
    cy.get(questionsButtonsContainer)
      .children()
      .each((button) => {
        cy.wrap(button).should('be.enabled')
      })
    cy.get(nextQuestionButton).should('be.disabled')
  })
  it('should enable the "Next question" button when the user has selected an option', () => {
    cy.get(questionsButtonsContainer).children().first().click()
    cy.get(nextQuestionButton).should('not.be.disabled')
  })
  it('should not show the generate button when no message has indicated that it is ready', () => {
    cy.get(generateButton).should('not.exist')
  })
  it('shows a loading indicator when waiting for the next question', () => {
    cy.get(questionsButtonsContainer).children().first().click()
    cy.get(nextQuestionButton).click()
    cy.get(loadingSpinner).should('be.visible')
  })
  it('handles Generate button click', () => {
    cy.get(questionsButtonsContainer).children().first().click()
    cy.get(nextQuestionButton).click()
    cy.get(generateButton).should('be.visible')
    cy.get(generateButton).click()
    cy.get(loadingSpinner).should('be.visible')
    cy.get('@onSubmit').should('be.called')
  })
})
