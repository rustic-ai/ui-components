import { supportedViewports } from '../../../cypress/support/variables'
import CodeSnippet from './codeSnippet'

describe('Code Snippet', () => {
  const code = 'console.log("Hello, World!");'
  const language = 'javascript'
  const codeBlock = '[data-cy="code-block"]'
  const languageType = '[data-cy="language-type"]'

  beforeEach(() => {
    cy.mount(<CodeSnippet code={code} language={language} />)
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the code snippet correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(codeBlock).contains(code)
    })

    it(`displays the language in the header on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(languageType).contains(language)
    })
  })
})
