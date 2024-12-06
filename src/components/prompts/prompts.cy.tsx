import {
  supportedViewports,
  testUser,
} from '../../../cypress/support/variables'
import Prompts from './prompts'

describe('Prompts', () => {
  const buttonsContainer = '[data-cy=buttons-container]'
  const prompts = ['Option 1', 'Option 2', 'Option 3']

  const commonProps = {
    prompts,
    conversationId: '1',
    sender: testUser,
  }

  beforeEach(() => {
    const mockWsClient = {
      send: cy.stub().as('sendStub'),
      close: cy.stub(),
      reconnect: cy.stub(),
    }

    cy.mount(<Prompts {...commonProps} ws={mockWsClient} />)
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the component correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(buttonsContainer).should('be.visible')
      cy.get(buttonsContainer).children().should('have.length', prompts.length)
      prompts.forEach((prompt, index) => {
        cy.get(buttonsContainer).children().eq(index).should('contain', prompt)
      })
    })

    it(`sends a message when a prompt is clicked on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(buttonsContainer).children().first().click()
      cy.get('@sendStub').should('be.calledOnce')
      cy.get('@sendStub').should(
        'be.calledWith',
        Cypress.sinon.match({
          data: { text: prompts[0] },
          conversationId: commonProps.conversationId,
          sender: commonProps.sender,
          format: 'text',
        })
      )
    })
  })
})
