import { supportedViewports } from '../../../cypress/support/variables'
import Question from './question'

describe('Question', () => {
  const question = '[data-cy=question]'
  const buttonGroup = '[data-cy=button-group]'
  const noAnswersMessage = '[data-cy=no-answers-message]'

  const title = 'Sample title'
  const description = 'Sample description'
  const answers = [
    { label: 'Accept', value: 0 },
    { label: 'Ignore', value: 1 },
  ]

  const commonProps = {
    title,
    description,
    conversationId: '1',
    sender: 'You',
    messageId: '1',
  }

  beforeEach(() => {
    const mockWsClient = {
      send: cy.stub().as('sendStub'),
      close: cy.stub(),
      reconnect: cy.stub(),
    }

    cy.mount(<Question {...commonProps} ws={mockWsClient} answers={answers} />)
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the component correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(question).should('be.visible')
      cy.get(buttonGroup).children().should('have.length', answers.length)
      cy.get(question).should('contain', title)
      cy.get(question).should('contain', description)
    })

    it(`sends a message when an answer has been chosen on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(question).should('be.visible')
      cy.get(buttonGroup).children().first().click()
      cy.get('@sendStub').should('be.calledOnce')
    })

    it(`does not render buttons when the choices array is empty on ${viewport} screen`, () => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }
      cy.mount(<Question {...commonProps} ws={mockWsClient} answers={[]} />)
      cy.viewport(viewport)
      cy.get(buttonGroup).should('not.exist')
      cy.get(noAnswersMessage).should('contain', 'No answers were provided.')
    })
  })
})
