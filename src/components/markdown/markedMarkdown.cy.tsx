import { supportedViewports } from '../../../cypress/support/variables'
import MarkedMarkdown from './markedMarkdown'

describe('Markdown', () => {
  supportedViewports.forEach((viewport) => {
    it(`renders properly formatted headers on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<MarkedMarkdown text="# Hello World" />)
      cy.get('h1').should('have.text', 'Hello World')
    })

    it(`renders properly formatted markdown with links on ${viewport} screen`, () => {
      cy.viewport(viewport)
      const text = '[Hello World](https://www.google.com)'
      cy.mount(<MarkedMarkdown text={text} />)
      cy.get('a').should('have.attr', 'href', 'https://www.google.com')
      cy.get('a').should('have.text', 'Hello World')
    })

    it(`renders properly formatted markdown with images on ${viewport} screen`, () => {
      const text =
        '![Hello World](https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png)'
      cy.viewport(viewport)
      cy.mount(<MarkedMarkdown text={text} />)
      cy.get('img').should(
        'have.attr',
        'src',
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
      )
      cy.get('img').should('have.attr', 'alt', 'Hello World')
    })

    it(`renders properly formatted markdown with bold text on ${viewport} screen`, () => {
      const text = '**Hello World**'
      cy.viewport(viewport)
      cy.mount(<MarkedMarkdown text={text} />)
      cy.get('strong').should('have.text', 'Hello World')
    })

    it(`renders properly formatted code blocks on ${viewport} screen`, () => {
      const text =
        '```\nconst greeting = "Hello, World!";\nconsole.log(greeting);\n```'
      cy.viewport(viewport)
      cy.mount(<MarkedMarkdown text={text} />)
      cy.get('code').should(
        'have.text',
        'const greeting = "Hello, World!";\nconsole.log(greeting);\n'
      )
    })

    it(`should not include zero width spaces at the start of the string on ${viewport} screen`, () => {
      const text = '\u200BHello World'
      cy.viewport(viewport)
      cy.mount(<MarkedMarkdown text={text} />)
      cy.get('p').last().should('have.text', 'Hello World')
      cy.get('p').last().should('not.contain', '\u200B')
    })

    it(`renders properly formatted markdown with different elements on ${viewport} screen`, () => {
      const header = '# Hello World'
      const list = '* List item 1\n* List item 2'
      const codeblock = '```\nconst hello = "world"\n```'
      const paragraph = "Here's a paragraph"

      const numberOfListItems = 2

      const text = `${header}\n${list}\n${codeblock}\n${paragraph}`

      cy.viewport(viewport)
      cy.mount(<MarkedMarkdown text={text} />)
      cy.get('h1').should('have.text', 'Hello World')
      cy.get('li').should('have.length', numberOfListItems)
      cy.get('li').eq(0).should('have.text', 'List item 1')
      cy.get('code').should('have.text', 'const hello = "world"\n')
      cy.get('p').last().should('have.text', "Here's a paragraph")
    })
  })
})
