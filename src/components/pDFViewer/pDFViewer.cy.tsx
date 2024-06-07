import { supportedViewports } from '../../../cypress/support/variables'
import PDFViewer from './pDFViewer'

describe('Table', () => {
  const pdfUrl = '/files/pdfExample.pdf'
  const canvasSelector = '[data-cy=rustic-pdf-canvas]'
  const pageInputSelector = '[data-cy=rustic-pdf-page-input] input'
  const pageIndicatorSelector = '[data-cy=rustic-pdf-page-indicator]'
  const nextPageButtonSelector = '[data-cy=rustic-next-page-button]'
  const previousPageButtonSelector = '[data-cy=rustic-previous-page-button]'
  supportedViewports.forEach((viewport) => {
    it(`can flip page and show the correct page number on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<PDFViewer url={pdfUrl} isOpen={true} onClose={() => {}} />)

      cy.get(canvasSelector).should('exist')
      cy.get(pageInputSelector).should('have.value', '1')
      cy.get(pageIndicatorSelector).should('contain', 'of 3')

      cy.get(nextPageButtonSelector).click()
      cy.get(pageInputSelector).should('have.value', '2')

      cy.get(previousPageButtonSelector).click()
      cy.get(pageInputSelector).should('have.value', '1')
    })

    it(`can jump to another page by changing the page number on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<PDFViewer url={pdfUrl} isOpen={true} onClose={() => {}} />)

      cy.get(canvasSelector).should('exist')
      cy.get(pageInputSelector).should('have.value', '1')
      cy.get(pageIndicatorSelector).should('contain', 'of 3')

      cy.get(pageInputSelector).click()
      cy.get(pageInputSelector).clear()
      cy.get(pageInputSelector).type('3')
      cy.get(pageInputSelector).should('have.value', '3')
    })
  })
})
