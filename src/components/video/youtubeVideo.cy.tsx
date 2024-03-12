import YoutubeVideo from './youtubeVideo'

describe('YoutubeVideo', () => {
  const youtubeVideoId = 'MtN1YnoL46Q'
  const youtubeVideoIframe = '[data-cy="youtube-video-iframe"]'
  const playButton = 'button.ytp-large-play-button'

  it('plays the video when clicked if loading was successful', () => {
    cy.mount(<YoutubeVideo youtubeVideoId={youtubeVideoId} />)
    cy.get(youtubeVideoIframe)
      .should('be.visible')
      .then(($iframe) => {
        // Wait for the iframe to load completely
        return new Cypress.Promise((resolve) => {
          $iframe.on('load', () => {
            resolve($iframe)
          })
        })
      })
      .then(($iframe) => {
        // Wait for the iframe content to load completely
        cy.wrap($iframe)
          .should('have.prop', 'contentDocument')
          .its('body')
          .should('not.be.empty')

        // Access the iframe's contentDocument and find the play button
        cy.wrap($iframe)
          .its('0.contentDocument')
          .then(($iframeDoc) => {
            cy.wrap($iframeDoc).find(playButton).should('be.visible').click()

            // Check if the button with data-title-no-tooltip="Pause" exists
            cy.wrap($iframeDoc)
              .find('button[data-title-no-tooltip="Pause"]')
              .should('exist')
          })
      })
  })

  it('shows an error message by youtube if the youtubeVideoId prop is invalid', () => {
    cy.mount(<YoutubeVideo youtubeVideoId="invalidId" />)
    cy.get(youtubeVideoIframe)
      .should('be.visible')
      .then(($iframe) => {
        // Wait for the iframe to load completely
        return new Cypress.Promise((resolve) => {
          $iframe.on('load', () => {
            resolve($iframe)
          })
        })
      })
      .then(($iframe) => {
        cy.wrap($iframe)
          .should('have.prop', 'contentDocument')
          .its('body')
          .should('not.be.empty')

        cy.wrap($iframe)
          .its('0.contentDocument')
          .then(($iframeDoc) => {
            cy.wrap($iframeDoc).find(playButton).should('be.visible').click()

            cy.wrap($iframeDoc)
              .find('span')
              .should('contain', 'An error occurred')
          })
      })
  })

  it('shows an error message by youtube if the youtubeVideoId prop is empty', () => {
    cy.mount(<YoutubeVideo youtubeVideoId="" />)
    cy.get(youtubeVideoIframe)
      .should('be.visible')
      .should('exist')
      .then(($iframe) => {
        // Wait for the iframe to load completely
        return new Cypress.Promise((resolve) => {
          $iframe.on('load', () => {
            resolve($iframe)
          })
        })
      })
      .then(($iframe) => {
        cy.wrap($iframe)
          .should('have.prop', 'contentDocument')
          .its('body')
          .should('not.be.empty')

        cy.wrap($iframe)
          .its('0.contentDocument')
          .then(($iframeDoc) => {
            cy.wrap($iframeDoc).find(playButton).should('be.visible').click()

            cy.wrap($iframeDoc)
              .find('span')
              .should('contain', 'An error occurred')
          })
      })
  })

  it('takes up the full size of parent when no width or height is provided', () => {
    const divWidth = 400
    const divHeight = 300

    cy.mount(
      <div style={{ width: `${divWidth}px`, height: `${divHeight}px` }}>
        <YoutubeVideo youtubeVideoId={youtubeVideoId} />
      </div>
    )

    cy.get(youtubeVideoIframe).should('be.visible')
    cy.get(youtubeVideoIframe).should('have.class', 'rustic-fit-container')

    cy.get(youtubeVideoIframe).invoke('width').should('equal', divWidth)
    cy.get(youtubeVideoIframe).invoke('height').should('equal', divHeight)
  })
})
