import OpenLayersMap from './openLayersMap'

describe('Map', () => {
  beforeEach(() => {
    cy.mount(<OpenLayersMap longitude={-123.1115} latitude={49.2856} />)
  })

  it('renders the map canvas', () => {
    cy.get('.ol-layer canvas').should('be.visible')
  })

  it('shows the marker', () => {
    cy.get('svg').should('be.visible').should('have.css', 'font-size')
  })

  it('shows an error if the coordinates are invalid', () => {
    cy.mount(<OpenLayersMap longitude={-181} latitude={49.2856} />)
    cy.contains('Invalid coordinates').should('be.visible')
  })
})
