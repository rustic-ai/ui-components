/* eslint-disable no-console */
import { supportedViewports } from '../../../cypress/support/variables'
import Icon from '../icon'
import NavBar from './navBar'

describe('NavBar', () => {
  const Logo = () => {
    return <span>Example Logo</span>
  }

  const navBarTop = '[data-cy=nav-bar-top]'
  const navBarTopItems = '[data-cy=nav-bar-top-items]'
  const navBarBottom = '[data-cy=nav-bar-bottom]'

  const topNavItems = [
    {
      node: <Icon name="notifications" />,
    },
    {
      node: <Icon name="account_circle" />,
    },
  ]

  const bottomNavItems = [
    {
      label: 'Conversations',
      onClick: () => console.log('Conversations'),
      icon: <Icon name="forum" />,
    },
    {
      label: 'New Conversation',
      onClick: () => console.log('New Conversation'),
      icon: <Icon name="add_circle_outline" />,
    },
    {
      label: 'Collections',
      onClick: () => console.log('Collections'),
      icon: <Icon name="bookmark" />,
    },
  ]

  beforeEach(() => {
    cy.mount(
      <NavBar
        logo={<Logo />}
        topNavBarItems={topNavItems}
        bottomNavBarItems={bottomNavItems}
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the nav bar correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(navBarTop).should('be.visible')

      cy.get(navBarTopItems)
        .children()
        .should('have.length', topNavItems.length)

      cy.get(navBarTopItems)
        .children()
        .each(($child) => {
          // For each child element, assert that it is visible
          cy.wrap($child).should('be.visible')
        })

      if (viewport === 'iphone-6') {
        cy.get(navBarBottom)
          .children()
          .should('have.length', bottomNavItems.length)

        cy.get(navBarBottom)
          .children()
          .each(($child) => {
            // For each child element, assert that it is visible
            cy.wrap($child).should('be.visible')
          })
      }
    })

    it(`should not render the top nav bar when there are no items or a logo on ${viewport} screen`, () => {
      cy.mount(
        <NavBar topNavBarItems={[]} bottomNavBarItems={bottomNavItems} />
      )

      cy.get(navBarTop).should('not.exist')
    })
  })

  context('desktop', () => {
    beforeEach(() => {
      cy.viewport('macbook-13')
    })
    it('only renders the top nav bar', () => {
      cy.get(navBarTop).should('be.visible')
      cy.get(navBarBottom).should('not.exist')
    })
  })

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
    })

    it('renders both the top and bottom nav bar', () => {
      cy.get(navBarTop).should('be.visible')
      cy.get(navBarBottom).should('be.visible')
    })
    it('executes the onClick function for each bottom nav bar item', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'log').as('consoleLogSpy')
      })

      cy.get(navBarBottom)
        .children()
        .each(($child, index) => {
          // For each child element, assert that it is visible
          cy.wrap($child).click()
          cy.get('@consoleLogSpy').should(
            'be.calledWith',
            bottomNavItems[index].label
          )
        })
    })

    it('should not render the bottom nav bar items if there are no items', () => {
      cy.mount(
        <NavBar
          logo={<Logo />}
          topNavBarItems={topNavItems}
          bottomNavBarItems={[]}
        />
      )

      cy.get(navBarBottom).should('not.exist')
    })
  })
})
