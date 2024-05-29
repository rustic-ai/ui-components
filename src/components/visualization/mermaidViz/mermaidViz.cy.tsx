import { supportedViewports } from '../../../../cypress/support/variables'
import MermaidViz from './mermaidViz'

describe('MermaidViz', () => {
  const codeExample = `
    flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]`
  const mermaidContainer = '[data-cy="mermaid-container"]'

  supportedViewports.forEach((viewport) => {
    it(`should display the diagram on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(
        <MermaidViz
          code={codeExample}
          title="Christmas Shopping"
          description="A flow chart"
        />
      )

      cy.get(mermaidContainer).should('exist')
      cy.get(mermaidContainer).should('contain', 'Christmas Shopping')
      cy.get(mermaidContainer).should('contain', 'A flow chart')
    })
  })
})
