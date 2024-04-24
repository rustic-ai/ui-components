import { supportedViewports } from '../../../cypress/support/variables'
import ChoiceSelector from './choiceSelector'

describe('ChoiceSelector', () => {
  const choiceSelector = '[data-cy=choice-selector]'
  const buttonGroup = '[data-cy=button-group]'
  const submitButton = '[data-cy=submit-button]'
  const noChoicesMessage = '[data-cy=no-choices-message]'

  const sendStub = '@sendStub'

  const description = 'Sample description'
  const choices = ['Accept', 'Ignore']
  const multipleSelection = ['Tokyo', 'Seoul', 'London', 'New York City']

  const commonProps = {
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

    cy.mount(
      <ChoiceSelector
        {...commonProps}
        ws={mockWsClient}
        choices={choices}
        prompt={description}
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the component correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(choiceSelector).should('be.visible')
      cy.get(buttonGroup).children().should('have.length', choices.length)
      cy.get(choiceSelector).should('contain', description)
    })
    it(`disables the buttons when a choice has been selected on ${viewport} screen`, () => {
      const ignore = choices[1]
      cy.viewport(viewport)
      cy.get(buttonGroup)
        .find('button')
        .last()
        .should('contain', ignore)
        .click()

      cy.get(sendStub).should('be.called')
      cy.get(buttonGroup).find('button').first().should('be.disabled')
      cy.get(buttonGroup).find('button').last().should('be.disabled')
    })
    it(`renders disabled buttons if there's already been a saved response on ${viewport} screen`, () => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.mount(
        <ChoiceSelector
          {...commonProps}
          ws={mockWsClient}
          choices={choices}
          savedResponse={['Ignore']}
        />
      )

      cy.viewport(viewport)
      cy.get(buttonGroup).find('button').first().should('be.disabled')
      cy.get(buttonGroup).find('button').last().should('be.disabled')
    })
    it(`submits when clicking the submit button if more than one choice can be selected on ${viewport} screen`, () => {
      const mockWsClient = {
        send: cy.stub().as('sendStub'),
        close: cy.stub(),
        reconnect: cy.stub(),
      }

      cy.mount(
        <ChoiceSelector
          {...commonProps}
          ws={mockWsClient}
          choices={multipleSelection}
          acceptsMultiple
        />
      )

      cy.viewport(viewport)
      cy.get(buttonGroup)
        .children()
        .should('have.length', multipleSelection.length)
      cy.get(buttonGroup).find('button').first().click()
      cy.get(sendStub).should('not.be.called')
      cy.get(buttonGroup).find('button').last().should('be.enabled').click()
      cy.get(submitButton).should('be.enabled').click()
      cy.get(sendStub).should('be.called')
      cy.get(submitButton).should('be.disabled')
    })
    it(`does not render buttons when the choices array is empty on ${viewport} screen`, () => {
      const mockWsClient = {
        send: cy.stub(),
        close: cy.stub(),
        reconnect: cy.stub(),
      }
      cy.mount(
        <ChoiceSelector {...commonProps} ws={mockWsClient} choices={[]} />
      )
      cy.viewport(viewport)
      cy.get(buttonGroup).should('not.exist')
      cy.get(noChoicesMessage).should(
        'contain',
        'No choice selections were provided.'
      )
    })
  })
})
