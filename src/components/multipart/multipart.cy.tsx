import React from 'react'

import { supportedViewports } from '../../../cypress/support/variables'
import Multipart from './multipart'

describe('Multipart Component', () => {
  const props = {
    text: 'This is a test message',
    files: ['image.jpg', 'document.pdf'],
  }

  const filePreviw = `[data-cy=file-preview]`
  supportedViewports.forEach((viewport) => {
    it(`renders text and file previews correctly on ${viewport} screen`, () => {
      const maximumFileNameLength = 15
      cy.mount(<Multipart {...props} />)

      cy.contains(props.text).should('be.visible')
      cy.get(filePreviw).should('have.length', props.files.length)

      props.files.forEach((file, index) => {
        cy.get(`${filePreviw}:eq(${index})`).within(() => {
          cy.get('[data-cy=file-name]').should(
            'contain',
            file.substring(0, maximumFileNameLength)
          )
        })
      })
    })

    it(`renders without text on ${viewport} screen`, () => {
      cy.mount(<Multipart files={props.files} />)

      cy.contains(props.text).should('not.exist')
      cy.get(filePreviw).should('have.length', props.files.length)
    })
  })
})
