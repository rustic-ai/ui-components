import Question from '../question/question'
import PromptBuilder from './promptBuilder'

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
    messages: [
      {
        id: '1',
        format: 'question',
        data: { title: 'Sample title', options: ['Accept', 'Ignore'] },
        sender: { name: 'agent', id: '123' },
        timestamp: '2021-01-01T00:00:00.000Z',
        conversationId: '1',
      },
    ],
    sender: { name: 'user', id: '1234' },
    messageId: '123',
    supportedElements: { question: Question },
  }

  beforeEach(() => {
    const stubbedFunctions = {
      onClose: cy.stub().as('onClose'),
      onGenerate: cy.stub().as('onGenerate'),
      ws: {
        send: cy.stub().as('send'),
        close: cy.stub(),
        reconnect: cy.stub(),
      },
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
    cy.get('@onClose').should('be.called')
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

  it('shows a loading indicator when waiting for the next question', () => {
    cy.get(questionsButtonsContainer).children().first().click()
    cy.get(nextQuestionButton).click()
    cy.get(loadingSpinner).should('be.visible')
  })

  it('should not show the generate button when no message has indicated that it is ready', () => {
    cy.get(generateButton).should('not.exist')
  })

  it('handles Generate button click', () => {
    const mockProps = {
      messages: [
        {
          id: '1',
          format: 'text',
          data: {
            text: 'Generate a prompt now or help me learn more for a better result.',
          },
          sender: { name: 'agent', id: '123' },
          timestamp: '2021-01-01T00:00:00.000Z',
          conversationId: '1',
        },
        {
          id: '2',
          format: 'promptBuilder',
          data: {
            isLastQuestion: true,
          },
          sender: { name: 'agent', id: '123' },
          timestamp: '2021-01-01T00:00:00.000Z',
          conversationId: '1',
        },
      ],
      sender: { name: 'user', id: '1234' },
      messageId: '123',
      supportedElements: { question: Question },
    }

    const stubbedFunctions = {
      onClose: cy.stub().as('onClose'),
      onGenerate: cy.stub().as('onGenerate'),
      ws: {
        send: cy.stub().as('send'),
        close: cy.stub(),
        reconnect: cy.stub(),
      },
    }

    cy.mount(<PromptBuilder {...mockProps} {...stubbedFunctions} />)

    cy.get(generateButton).should('be.visible')
    cy.get(generateButton).click()
    cy.get(loadingSpinner).should('be.visible')
    cy.get('@onGenerate').should('be.called')
  })
})
