import { supportedViewports } from '../../../cypress/support/variables'
import PDFViewer from './pdfViewer'

describe('PDF Viewer', () => {
  const pdfUrl = '/files/pdfExample.pdf'
  const canvasSelector = '[data-cy=pdf-canvas]'
  const pageInputSelector = '[data-cy=pdf-page-input] input'
  const pageIndicatorSelector = '[data-cy=pdf-page-indicator]'
  const nextPageButtonSelector = '[data-cy=next-page-button]'
  const zoomOutButton = '[data-cy=zoom-out-button]'
  const zoomInButton = '[data-cy=zoom-in-button]'
  const previousPageButtonSelector = '[data-cy=previous-page-button]'

  supportedViewports.forEach((viewport) => {
    it(`can flip page and show the correct page number on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<PDFViewer url={pdfUrl} />)

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
      cy.mount(<PDFViewer url={pdfUrl} />)

      cy.get(canvasSelector).should('exist')
      cy.get(pageInputSelector).should('have.value', '1')
      cy.get(pageIndicatorSelector).should('contain', 'of 3')

      cy.get(pageInputSelector).click()
      cy.get(pageInputSelector).clear()
      cy.get(pageInputSelector).type('3')
      cy.get(pageInputSelector).should('have.value', '3')
    })
  })

  context('Desktop', () => {
    const desktopInitialCanvasWidth = 918

    it('should zoom in and out', () => {
      cy.viewport('macbook-15')
      cy.mount(<PDFViewer url={pdfUrl} />)

      cy.get(canvasSelector)
        .invoke('outerWidth')
        .should('be.eq', desktopInitialCanvasWidth)

      cy.get(zoomInButton).click()
      cy.get(canvasSelector)
        .invoke('outerWidth')
        .should('be.gt', desktopInitialCanvasWidth)

      cy.get(zoomOutButton).click()
      cy.get(canvasSelector)
        .invoke('outerWidth')
        .should('be.eq', desktopInitialCanvasWidth)
    })
  })

  context('Mobile', () => {
    const mobileInitialCanvasWidth = 306

    it('should zoom in and out', () => {
      cy.viewport('iphone-6')
      cy.mount(<PDFViewer url={pdfUrl} />)

      cy.get(canvasSelector)
        .invoke('outerWidth')
        .should('be.eq', mobileInitialCanvasWidth)

      cy.get(zoomInButton).click()
      cy.get(canvasSelector)
        .invoke('outerWidth')
        .should('be.gt', mobileInitialCanvasWidth)

      cy.get(zoomOutButton).click()
      cy.get(canvasSelector)
        .invoke('outerWidth')
        .should('be.eq', mobileInitialCanvasWidth)
    })
  })
})
