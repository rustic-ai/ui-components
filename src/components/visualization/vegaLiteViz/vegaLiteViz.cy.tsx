import type { VisualizationSpec } from 'vega-embed'

import { supportedViewports } from '../../../../cypress/support/variables'
import VegaLiteViz from './vegaLiteViz'

describe('VegaLiteViz', () => {
  beforeEach(() => {
    cy.mount(
      <VegaLiteViz
        spec={{
          $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
          width: 'container',
          data: {
            values: [
              { a: 'A', b: 28 },
              { a: 'B', b: 55 },
              { a: 'C', b: 43 },
            ],
          },
          mark: 'bar',
          encoding: {
            x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
            y: { field: 'b', type: 'quantitative' },
          },
        }}
        theme={{
          dark: 'dark',
        }}
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`should display the graphic on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.get('[data-cy="vega-lite"]').should('exist')
    })

    it(`should show the menu options properly on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.get('[data-cy="vega-lite"]').should('exist')
      cy.get('.rustic-vega-lite').should('exist')
      cy.get('[data-cy="menu-icon-button"]').click()
      cy.contains('Save as SVG').should('exist')
      cy.contains('Save as PNG').should('exist')
    })

    const invalidSpec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      data: {
        values: [
          { a: 'A', b: 28 },
          { a: 'B', b: 55 },
        ],
      },
      encoding: {
        x: { field: 'a', type: 'nominal', axis: { labelAngle: 0 } },
        y: { field: 'b', type: 'quantitative' },
      },
    } as VisualizationSpec

    it(`displays an error message if the spec is wrong on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <VegaLiteViz
          spec={invalidSpec}
          theme={{
            dark: 'dark',
          }}
        />
      )
      cy.get('p').contains('Failed to load the chart.')
    })
  })
})
