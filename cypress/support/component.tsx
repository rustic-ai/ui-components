// ***********************************************************
// This example support/component.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// If more commands are needed, create a commands.js file in the support folder and import them here.

import { StyledEngineProvider } from '@mui/material/styles'
import ThemeProvider from '@mui/system/ThemeProvider'
import { mount } from 'cypress/react18'

import rusticTheme from '../../src/rusticTheme'

Cypress.Commands.add('mount', (component, options) => {
  return mount(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={rusticTheme}>{component}</ThemeProvider>
    </StyledEngineProvider>,
    options
  )
})

Cypress.Commands.add('hoverAndDisplay', (element) => {
  cy.get(element).realHover()
  cy.get(element).should('be.visible')
})
