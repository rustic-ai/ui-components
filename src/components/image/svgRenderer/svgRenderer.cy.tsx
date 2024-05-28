import { supportedViewports } from '../../../../cypress/support/variables'
import SvgRenderer from './svgRenderer'

describe('Image', () => {
  const svgCode = `<svg viewbox='0 0 400 400' xmlns='http://www.w3.org/2000/svg' height='60vmin' width='60vmin'>
  <rect x='0' y='0' width='50%' height='50%' fill='tomato' opacity='0.75' />
  <rect x='25%' y='25%' width='50%' height='50%' fill='slategrey' opacity='0.75' />
  <rect x='50%' y='50%' width='50%' height='50%' fill='olive' opacity='0.75' />
  <rect x='0' y='0' width='100%' height='100%' stroke='cadetblue' stroke-width='0.5%' fill='none' />
  </svg>`

  const rectTagsAmount = 4

  beforeEach(() => {
    cy.mount(<SvgRenderer code={svgCode} />)
  })

  supportedViewports.forEach((viewport) => {
    it(`should render the svg on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.get('svg').should('be.visible')
      cy.get('svg').should('have.attr', 'viewBox', '0 0 400 400')
      cy.get('svg').should('have.attr', 'xmlns', 'http://www.w3.org/2000/svg')
      cy.get('svg rect').should('have.length', rectTagsAmount)
    })
  })
})
