import { supportedViewports } from '../../../cypress/support/variables'
import Image from './image'

describe('Image', () => {
  const defaultProps = {
    src: 'public/images/image-component-example.png',
  }

  supportedViewports.forEach((viewport) => {
    it(`should render an image with the provided URL on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Image {...defaultProps} />)

      cy.get('img').should('have.attr', 'src', defaultProps.src)
    })

    it(`should set the alt attribute to "An image is displayed" if no alt prop is provided on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Image {...defaultProps} />)

      cy.get('img').should('have.attr', 'alt', 'An image is displayed')
    })

    it(`renders responsively if no width or height props are provided on ${viewport} screen`, () => {
      cy.viewport(viewport)

      const divWidth = 200

      cy.mount(
        <div style={{ width: `${divWidth}px` }}>
          <Image {...defaultProps} />
        </div>
      )

      cy.get('img').should('have.class', 'rustic-fit-container')
      cy.get('img').invoke('width').should('equal', divWidth)
    })

    it(`renders image with provided props on ${viewport} screen`, () => {
      cy.viewport(viewport)
      const props = {
        src: 'public/images/image-component-example.png',
        alt: 'A curved facade covered in white latticework',
        width: 400,
        height: 400,
      }

      cy.mount(<Image {...props} />)

      cy.get('img')
        .should('have.attr', 'src', defaultProps.src)
        .and('have.attr', 'alt', 'A curved facade covered in white latticework')
        .and('have.attr', 'width', props.width)
        .and('have.attr', 'height', props.height)
    })

    it(`displays error when image fails to load on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Image src="/invalid.jpg" />)

      cy.contains('Image failed to load').should('be.visible')
    })

    it(`shows loader initially on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Image {...defaultProps} />)

      cy.get('[data-cy="spinner"]').should('be.visible')
    })

    it(`shows image description if provided on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<Image {...defaultProps} description="image description" />)

      cy.get('p').should('contain', 'image description')
    })
  })
})
