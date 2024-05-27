import { supportedViewports } from '../../../cypress/support/variables'
import Question from './question'

describe('Question', () => {
  const question = '[data-cy=question]'
  const buttonsContainer = '[data-cy=buttons-container]'

  const title = 'Sample title'
  const description = 'Sample description'
  const options = ['Accept', 'Ignore']

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

    cy.mount(<Question {...commonProps} ws={mockWsClient} options={options} />)
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the component correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(question).should('be.visible')
      cy.get(buttonsContainer).children().should('have.length', options.length)
      cy.get(question).should('contain', title)
      cy.get(question).should('contain', description)
    })

    it(`sends a message when an answer has been chosen on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(question).should('be.visible')
      cy.get(buttonsContainer).children().first().click()
      cy.get('@sendStub').should('be.calledOnce')
    })

    it(`disabled the buttons when an answer has been chosen on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(question).should('be.visible')
      cy.get(buttonsContainer).children().first().click()
      cy.get(buttonsContainer).children().first().should('be.disabled')
      cy.get(buttonsContainer).children().last().should('be.disabled')
    })
  })
})
