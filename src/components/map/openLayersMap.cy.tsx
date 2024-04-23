import { supportedViewports } from '../../../cypress/support/variables'
import OpenLayersMap from './openLayersMap'

describe('Map', () => {
  beforeEach(() => {
    cy.mount(<OpenLayersMap longitude={-123.1115} latitude={49.2856} />)
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the map canvas on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('[data-cy=map-canvas] .ol-layer canvas').should('be.visible')

      cy.get('[data-cy="map-canvas"]').should(
        'have.class',
        'rustic-open-layers-map-canvas'
      )
    })

    it(`shows the marker on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('[data-cy=marker-container] span')
        .should('be.visible')
        .should('have.class', 'rustic-open-layers-map-marker')
    })

    it(`shows an error if the coordinates are invalid on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<OpenLayersMap longitude={-181} latitude={49.2856} />)
      cy.contains('Invalid coordinates').should('be.visible')
      cy.get('[data-cy=marker-container]').should('not.exist')
      cy.get('[data-cy=map-canvas]').should('not.exist')
    })
  })
})
