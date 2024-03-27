/* eslint-disable no-magic-numbers */
import { supportedViewports } from '../../../cypress/support/variables'
import SoundPlayer from './soundPlayer'

describe('Sound Player', () => {
  const audioElement = '[data-cy=audio-element]'
  const pauseButton = '[data-cy=pause-button]'
  const playButton = '[data-cy=play-button]'
  const transcript = '[data-cy=transcript]'
  const transcriptToggle = '[data-cy=transcript-toggle]'
  const error = '[data-cy=error]'

  beforeEach(() => {
    cy.mount(
      <SoundPlayer
        src="https://filmsupply-files.s3.amazonaws.com/fs/files/production/clip_mov/2264767/mp4.wat.h.484.IcbLxWaNAr0F1s8UzyCOZRWa3BJtiovHoZnYctBbHMtL7.mp4"
        title="Sound Player Component"
        transcript="This is a transcript."
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the sound player component on ${viewport} screen`, () => {
      cy.get('[data-cy=audio]').should('be.visible')
      cy.get('[data-cy=spinner]').should('be.visible')
      cy.get('[data-cy=spinner]').should('not.exist')
      cy.get('[data-cy=sound-player-title]').should('be.visible')
    })

    it(`should toggle between pause and play when clicking the play/pause button on ${viewport} screen`, () => {
      cy.get(playButton).should('be.visible')
      cy.get(audioElement).its('0.paused').should('equal', true)

      cy.get(playButton).click()
      cy.get(pauseButton).should('be.visible')
      cy.get(audioElement).its('0.paused').should('equal', false)

      cy.get(pauseButton).click()
      cy.get(playButton).should('be.visible')
    })

    it(`should go forwards and backwards 10 seconds when clicking the forward/back buttons on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get('[data-cy=forward-button]').click()
      cy.get(audioElement).its('0.currentTime').should('equal', 10)
      cy.get('[data-cy=replay-button]').click()
      cy.get(audioElement).its('0.currentTime').should('equal', 0)
    })

    it(`should change the playback speed when choosing from the playback menu on ${viewport} screen`, () => {
      cy.viewport(viewport)

      cy.get(audioElement).its('0.playbackRate').should('equal', 1)
      cy.get('[data-cy=menu-icon-button]').click()
      cy.get('[role=menuitem]').last().click()
      cy.get(audioElement).its('0.playbackRate').should('equal', 2)
    })

    it(`should change the volume when adjusting the volume slider on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(audioElement).its('0.volume').should('equal', 1)
      cy.get('[data-cy="volume-slider"]').type('{leftArrow}')
      cy.get(audioElement).its('0.volume').should('be.lessThan', 1)
    })

    it(`should change the time when the video progress slider is adjusted on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(audioElement).its('0.currentTime').should('equal', 0)
      cy.get('[data-cy=progress-slider]').type('{rightArrow}')
      cy.get(audioElement).its('0.currentTime').should('be.greaterThan', 0)
    })

    it(`should show and hide the transcript when clicking the transcript toggle on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(transcript).should('not.exist')
      cy.get(transcriptToggle).should('contain', 'Show')
      cy.get(transcriptToggle).click()
      cy.get(transcript).should('be.visible')
      cy.get(transcriptToggle).should('contain', 'Hide')
    })

    it(`should display an error message when the resource fails to load on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.mount(<SoundPlayer src="" />)

      cy.get(audioElement).should('not.exist')
      cy.get(error).should('be.visible')
      cy.get(error).should('contain', 'The audio resource has failed to load')
    })

    it(`should display an error message when the resource loading has been stalled on ${viewport} screen`, () => {
      cy.viewport(viewport)
      // Delay server response to simulate stalled media loading
      cy.intercept(
        'https://filmsupply-files.s3.amazonaws.com/fs/files/production/clip_mov/2264767/mp4.wat.h.484.IcbLxWaNAr0F1s8UzyCOZRWa3BJtiovHoZnYctBbHMtL7.mp4',
        (req) => {
          req.on('response', (res) => {
            // Wait for delay in milliseconds before sending the response to the client.
            res.setDelay(2000)
          })
        }
      ).as('mediaRequest')

      // Listen for the stalled event on the audio element
      cy.get(audioElement).then((audio) => {
        audio.on('stalled', () => {
          // Assertion to confirm that the stalled event was triggered
          expect(true).to.be.true
          cy.get(error).should('contain', 'Failed to fetch data, but trying')
        })
      })
    })
  })
})
