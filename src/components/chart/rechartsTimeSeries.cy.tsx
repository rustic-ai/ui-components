import { supportedViewports } from '../../../cypress/support/variables'
import RechartsTimeSeries from './rechartsTimeSeries'
describe('TimeSeries', () => {
  const timeSeries = [
    {
      timestamp: 1704096000000,
      uv: 4000,
      pv: 2400,
      amt: 2100,
    },
    {
      timestamp: 1704182400000,
      uv: 3000,
      pv: 1398,
      amt: 2500,
    },
    {
      timestamp: 1704268800000,
      uv: 3000,
      pv: 1398,
      amt: 2400,
    },
  ]

  const numberOfVariables = 3
  const exampleReferenceLineYAxis = 2000
  const legendItem = '[data-cy="legend-item"]'
  const menuIcon = '[aria-label="chart options"]'
  const lineChart = '[data-cy="line-chart"]'
  const barChart = '[data-cy="bar-chart"]'
  const areaChart = '[data-cy="area-chart"]'
  const referenceLineLabel = 'reference-line-label'

  beforeEach(() => {
    cy.mount(
      <RechartsTimeSeries
        timeSeries={timeSeries}
        title="title"
        description="This is a description"
        referenceLineYAxis={[exampleReferenceLineYAxis]}
        referenceLineLabel={[referenceLineLabel]}
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`should toggle chart types via the menu on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(lineChart).should('exist')

      cy.get(menuIcon).click()
      cy.contains('Chart Types')

      cy.get('[value="bar"]').click()
      cy.get(barChart).should('exist')
      cy.get(lineChart).should('not.exist')

      cy.get(menuIcon).click()
      cy.get('[value="area"]').click()
      cy.get(areaChart).should('exist')
    })

    it(`displays title, description, and reference line if provided on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.contains('title').should('be.visible')
      cy.contains('This is a description').should('be.visible')

      cy.contains(referenceLineLabel)
    })

    it(`should show a single line in the chart when clicking on a legend item on ${viewport} screen`, () => {
      cy.viewport(viewport)
      // Check if only the selected line is shown
      cy.get(legendItem).contains('uv').click()
      cy.get('.recharts-line path').should('have.attr', 'name', 'uv')
      cy.get('.recharts-line').should('have.length', 1)

      // Click again to show the unselected lines
      cy.get(legendItem).contains('uv').click()
      cy.get('.recharts-line path').should('have.length', numberOfVariables)
      cy.get('.recharts-line path').should('have.attr', 'name', 'uv')
      cy.get('.recharts-line path').last().should('have.attr', 'name', 'amt')
    })

    it(`can show two selected lines in the chart when clicking on two legend items on ${viewport} screen`, () => {
      cy.viewport(viewport)
      const numberOfSelectedLines = 2
      // Check if the selected lines are shown
      cy.get(legendItem).contains('uv').click()
      cy.get(legendItem).contains('pv').click()
      cy.get('.recharts-line path').should('have.attr', 'name', 'uv')
      cy.get('.recharts-line path').last().should('have.attr', 'name', 'pv')
      cy.get('.recharts-line path').should('have.length', numberOfSelectedLines)

      // Check if the selected lines can be unselected
      cy.get(legendItem).contains('uv').click()
      cy.get('.recharts-line path').should('have.length', 1)
      cy.get('.recharts-line path').should('not.have.attr', 'name', 'uv')
      cy.get('.recharts-line path').should('have.attr', 'name', 'pv')

      cy.get(legendItem).contains('pv').click()
      cy.get('.recharts-line path').should('have.length', numberOfVariables)
    })

    it(`should handle empty time series on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <RechartsTimeSeries
          timeSeries={[]}
          title="title"
          description="This is a description"
          referenceLineYAxis={[exampleReferenceLineYAxis]}
        />
      )

      cy.get('p').should('contain', 'No data available')
    })

    it(`can hide the chart type toggle and only show the default chart type on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <RechartsTimeSeries
          timeSeries={timeSeries}
          title="title"
          description="This is a description"
          disableChartTypeToggle={true}
          defaultChartType="area"
        />
      )
      cy.get(menuIcon).should('not.exist')
      cy.get(areaChart).should('exist')
    })
  })
})
