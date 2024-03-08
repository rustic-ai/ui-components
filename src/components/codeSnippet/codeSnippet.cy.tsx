import CodeSnippet from './codeSnippet'

describe('Code Snippet', () => {
  const code = 'console.log("Hello, World!");'
  const language = 'javascript'
  const codeBlock = '[data-cy="code-block"]'
  const languageType = '[data-cy="language-type"]'

  beforeEach(() => {
    cy.mount(<CodeSnippet code={code} language={language} />)
  })

  it('renders the code snippet correctly', () => {
    cy.get(codeBlock).contains(code)
  })

  it('displays the language in the header', () => {
    cy.get(languageType).contains(language)
  })
})
