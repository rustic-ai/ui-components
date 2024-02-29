import YoutubeVideo from './youtubeVideo'

describe('YoutubeVideo', () => {
  const youtubeVideoId = 'MtN1YnoL46Q'
  const youtubeVideoIframe = '[data-cy="youtube-video-iframe"]'
  const loadingSpinner = '[data-cy="spinner"]'
  const playButton = 'button.ytp-large-play-button'

  it('renders the video component with a spinner initially', () => {
    cy.mount(<YoutubeVideo youtubeVideoId={youtubeVideoId} />)
    cy.get(loadingSpinner).should('exist')
  })

  it('removes the spinner when a youtube response is received', () => {
    cy.mount(<YoutubeVideo youtubeVideoId={youtubeVideoId} />)

    cy.get(loadingSpinner).should('not.exist')
    cy.get(youtubeVideoIframe).then(($iframe) => {
      const src = $iframe.attr('src')
      if (src) {
        const successfulStatusCode = 200
        cy.request(src).its('status').should('equal', successfulStatusCode)
      }
    })
  })

  it('sanitizes the youtubeVideoId prop to prevent XSS', () => {
    const maliciousSrc = 'malicious<script>alert("XSS")</script>'
    cy.mount(<YoutubeVideo youtubeVideoId={maliciousSrc} />)
    cy.get(youtubeVideoIframe)
      .should('have.attr', 'src')
      .and('not.contain', 'script')
  })

  it('plays the video when clicked if loading was successful', () => {
    cy.mount(<YoutubeVideo youtubeVideoId={youtubeVideoId} />)
    cy.get(loadingSpinner).should('not.exist')
    cy.get(youtubeVideoIframe)
      .should('be.visible')
      .should('exist')
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
            cy.wrap($iframeDoc)
              .find(playButton)
              .should('be.visible')
              .should('exist')
              .click()

            // Check if the button with data-title-no-tooltip="Pause" exists
            cy.wrap($iframeDoc)
              .find('button[data-title-no-tooltip="Pause"]')
              .should('exist')
          })
      })
  })

  it('shows an error message by youtube if the youtubeVideoId prop is invalid', () => {
    cy.mount(<YoutubeVideo youtubeVideoId="invalidId" />)
    cy.get(loadingSpinner).should('not.exist')
    cy.get(youtubeVideoIframe)
      .should('be.visible')
      .should('exist')
      .then(($iframe) => {
        cy.wrap($iframe)
          .should('have.prop', 'contentDocument')
          .its('body')
          .should('not.be.empty')

        cy.wrap($iframe)
          .its('0.contentDocument')
          .then(($iframeDoc) => {
            cy.wrap($iframeDoc)
              .find(playButton)
              .should('be.visible')
              .should('exist')
              .click()

            cy.wrap($iframeDoc)
              .find('span')
              .should('contain', 'An error occurred')
          })
      })
  })
  it('shows an error message by youtube if the youtubeVideoId prop is empty', () => {
    cy.mount(<YoutubeVideo youtubeVideoId="" />)
    cy.get(loadingSpinner).should('not.exist')
    cy.get(youtubeVideoIframe)
      .should('be.visible')
      .should('exist')
      .then(($iframe) => {
        cy.wrap($iframe)
          .should('have.prop', 'contentDocument')
          .its('body')
          .should('not.be.empty')

        cy.wrap($iframe)
          .its('0.contentDocument')
          .then(($iframeDoc) => {
            cy.wrap($iframeDoc)
              .find(playButton)
              .should('be.visible')
              .should('exist')
              .click()

            cy.wrap($iframeDoc)
              .find('span')
              .should('contain', 'An error occurred')
          })
      })
  })
})
