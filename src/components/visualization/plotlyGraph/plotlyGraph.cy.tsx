import { supportedViewports } from '../../../../cypress/support/variables'
import PlotlyGraph from "./plotlyGraph"

describe('PlotlyGraph', () => {
  beforeEach(() => {
    cy.mount(
      <PlotlyGraph
        plotParams={{
          data:[{
            x:  ['Product A', 'Product B', 'Product C'],
            y: [20, 14, 23],
            type: 'bar',
            text: [20, 14, 23].map(String),
            textposition: 'auto',
            hoverinfo: 'none',
            marker: {
              color: 'rgb(158,202,225)',
              opacity: 0.6,
              line: {
                color: 'rgb(8,48,107)',
                width: 1.5
              }
            }
          }],
          layout:{
            title: 'January 2013 Sales Report',
            barmode: 'stack'
          }
        }}
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`should display the graphic on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.get('.rustic-plotly').should('exist')
      cy.get('[data-cy="plotly"]').should('exist')
    })
  })
})
