import Image from './image'

describe('Image', () => {
  const defaultProps = {
    url: 'https://assets-global.website-files.com/629d4351d174c60f32a4141a/647bfa926280c5b1cbccd03b_dragonscale_full_colour_rgb_icon_logo-p-500.png',
  }
  it('should render an image with the provided URL', () => {
    cy.mount(<Image {...defaultProps} />)

    cy.get('img').should('have.attr', 'src', defaultProps.url)
  })

  it('should set the alt attribute to "An image is displayed" if no alt prop is provided', () => {
    cy.mount(<Image {...defaultProps} />)

    cy.get('img').should('have.attr', 'alt', 'An image is displayed')
  })

  it('renders responsively if no width or height props are provided', () => {
    const divWidth = 200

    cy.mount(
      <div style={{ width: `${divWidth}px` }}>
        <Image {...defaultProps} />
      </div>
    )

    cy.get('img').should('have.class', 'rustic-image-responsive')
    cy.get('img').invoke('width').should('equal', divWidth)
  })

  it('renders image with provided props', () => {
    const props = {
      url: 'https://assets-global.website-files.com/629d4351d174c60f32a4141a/647bfa926280c5b1cbccd03b_dragonscale_full_colour_rgb_icon_logo-p-500.png',
      alt: 'Dragonscale logo',
      width: 400,
      height: 400,
    }

    cy.mount(<Image {...props} />)

    cy.get('img')
      .should('have.attr', 'src', defaultProps.url)
      .and('have.attr', 'alt', 'Dragonscale logo')
      .and('have.attr', 'width', props.width)
      .and('have.attr', 'height', props.height)
  })

  it('displays error when image fails to load', () => {
    cy.mount(<Image url="/invalid.jpg" />)

    cy.contains('Image failed to load').should('be.visible')
  })

  it('shows loader initially', () => {
    cy.mount(<Image {...defaultProps} />)

    cy.get('[data-cy="spinner"]').should('be.visible')
  })
})
