import OpenLayersMap from './openLayersMap'

describe('Map', () => {
  beforeEach(() => {
    cy.mount(<OpenLayersMap longitude={-123.1115} latitude={49.2856} />)
  })

  it('renders the map canvas', () => {
    cy.get('[data-cy=map-canvas] .ol-layer canvas').should('be.visible')

    cy.get('[data-cy="map-canvas"]').should(
      'have.class',
      'rustic-open-layers-map-canvas'
    )
  })

  it('shows the marker', () => {
    cy.get('[data-cy=marker-container] svg')
      .should('be.visible')
      .should('have.class', 'rustic-open-layers-map-marker')
  })

  it('shows an error if the coordinates are invalid', () => {
    cy.mount(<OpenLayersMap longitude={-181} latitude={49.2856} />)
    cy.contains('Invalid coordinates').should('be.visible')
    cy.get('[data-cy=marker-container]').should('not.exist')
    cy.get('[data-cy=map-canvas]').should('not.exist')
  })
})
