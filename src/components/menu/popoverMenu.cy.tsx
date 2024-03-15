/* eslint-disable no-console */
import CheckIcon from '@mui/icons-material/Check'
import ClearIcon from '@mui/icons-material/Clear'
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat'
import React from 'react'

import PopoverMenu from './popoverMenu'

describe('PopOverMenu', () => {
  const ariaLabel = 'open menu'
  const openMenu = `[aria-label="${ariaLabel}"]`
  const popoverMenu = '[data-cy=menu]'
  const celsiusClicked = 'Celsius clicked'
  const fahrenheitClicked = 'Fahrenheit clicked'

  const menuItems = [
    {
      label: 'Celsius',
      onClick: () => {
        console.log(celsiusClicked)
      },
      startDecorator: <DeviceThermostatIcon />,
      endDecorator: <CheckIcon />,
    },
    {
      label: 'Fahrenheit',
      onClick: () => {
        console.log(fahrenheitClicked)
      },
      startDecorator: <DeviceThermostatIcon />,
      endDecorator: <ClearIcon />,
    },
  ]

  beforeEach(() => {
    cy.mount(<PopoverMenu menuItems={menuItems} ariaLabel={ariaLabel} />)
  })

  it('renders the component', () => {
    cy.get(openMenu).click()
    cy.get(popoverMenu).should('be.visible')
    cy.get(`${popoverMenu} li`).should('have.length', menuItems.length)
    // 4 icons in total should be seen
    // eslint-disable-next-line no-magic-numbers
    cy.get(`${popoverMenu} li svg`).should('have.length', 4)
  })

  it('renders the menu items in the order provided', () => {
    cy.get(openMenu).click()
    cy.get(popoverMenu).should('be.visible')
    cy.get(`${popoverMenu} li`).first().contains(menuItems[0].label)
    cy.get(`${popoverMenu} li`)
      .last()
      .contains(menuItems[menuItems.length - 1].label)
  })

  it('executes the passed on onClicks in each item', () => {
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLogSpy')
    })

    cy.get(openMenu).click()
    cy.get(popoverMenu).should('be.visible')
    cy.get(`${popoverMenu} li`).first().click()
    cy.get('@consoleLogSpy').should('be.calledWith', celsiusClicked)

    cy.get(openMenu).click()
    cy.get(popoverMenu).should('be.visible')
    cy.get(`${popoverMenu} li`).last().click()
    cy.get('@consoleLogSpy').should('be.calledWith', fahrenheitClicked)
  })

  it('has access to the event object when clicking an item', () => {
    cy.mount(
      <PopoverMenu
        menuItems={[
          {
            label: 'Celsius',
            onClick: (event?: React.MouseEvent<HTMLElement>) => {
              return console.log(event?.type)
            },
            startDecorator: <DeviceThermostatIcon />,
            endDecorator: <ClearIcon />,
          },
        ]}
        ariaLabel={ariaLabel}
      />
    )

    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLogSpy')
    })

    cy.get(openMenu).click()
    cy.get(popoverMenu).should('be.visible')
    cy.get(`${popoverMenu} li`).click()
    cy.get('@consoleLogSpy').should('be.calledWith', 'click')
  })

  it('renders the correct button if the buttonText prop is provided', () => {
    const button = '[data-cy=menu-button]'
    const iconButton = '[data-cy=menu-icon-button]'

    cy.mount(
      <PopoverMenu
        menuItems={menuItems}
        ariaLabel={ariaLabel}
        icon={<DeviceThermostatIcon />}
      />
    )

    cy.get(iconButton).should('be.visible')
    cy.get(button).should('not.exist')

    cy.mount(
      <PopoverMenu
        menuItems={menuItems}
        ariaLabel={ariaLabel}
        buttonText="Edit"
      />
    )
    cy.get(button).should('be.visible')
    cy.get(iconButton).should('not.exist')

    cy.mount(
      <PopoverMenu
        menuItems={menuItems}
        ariaLabel={ariaLabel}
        icon={<DeviceThermostatIcon />}
        buttonText="Temperature"
      />
    )
    cy.get(button).should('be.visible')
    cy.get(iconButton).should('not.exist')
  })

  it('closes the menu when clicking outside', () => {
    cy.get(openMenu).click()
    cy.get(popoverMenu).should('be.visible')
    cy.get('body').click()
    cy.get(popoverMenu).should('not.exist')
  })

  it('closes the menu when clicking an item', () => {
    cy.get(openMenu).click()
    cy.get(popoverMenu).should('be.visible')

    cy.get(`${popoverMenu} li`).first().click()
    cy.get(popoverMenu).should('not.exist')
  })

  it('shows the correct element when switching between mobile and desktop', () => {
    const drawer = '.MuiDrawer-root'
    const popover = '.MuiPopover-root'

    cy.get(openMenu).click()
    cy.get(popoverMenu).should('be.visible')
    cy.get(drawer).should('be.visible')
    cy.get(popover).should('not.exist')

    cy.viewport('macbook-16')
    cy.get(popoverMenu).should('be.visible')
    cy.get(popover).should('be.visible')
    cy.get(drawer).should('not.exist')
  })
})
