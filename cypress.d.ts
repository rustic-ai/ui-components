import type { mount } from 'cypress/react18'

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      dataCy(value: string): Chainable<JQuery<HTMLElement>>
      hoverAndDisplay(element: string): Chainable<any>
    }
  }
}
