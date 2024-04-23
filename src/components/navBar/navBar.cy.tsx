import { supportedViewports } from '../../../cypress/support/variables'
import NavBar from './navBar'

describe('NavBar', () => {
  const Logo = () => {
    return <span>Example Logo</span>
  }

  const navBar = '[data-cy=nav-bar]'
  const leftDrawerButton = '[data-cy=left-drawer-button]'
  const rightDrawerButton = '[data-cy=right-drawer-button]'

  // eslint-disable-next-line no-console
  const openLeftDrawer = () => console.log('left drawer opened')
  // eslint-disable-next-line no-console
  const openRightDrawer = () => console.log('right drawer opened')

  function renderIcon(iconName: string) {
    return <span className="material-symbols-rounded">{iconName}</span>
  }

  beforeEach(() => {
    cy.mount(
      <NavBar
        logo={<Logo />}
        leftDrawerIcon={renderIcon('bookmark')}
        rightDrawerIcon={renderIcon('chat')}
        leftDrawerAriaLabel="open left drawer"
        rightDrawerAriaLabel="open right drawer"
        handleLeftDrawerToggle={openLeftDrawer}
        handleRightDrawerToggle={openRightDrawer}
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the nav bar correctly on ${viewport} screen`, () => {
      cy.viewport(viewport)
      cy.get(navBar).should('be.visible')
    })
  })

  context('desktop', () => {
    it('does not render the left and right drawer buttons on screens larger than 900px', () => {
      const viewportWidth = 901
      const viewportHeight = 600

      cy.viewport(viewportWidth, viewportHeight)
      cy.get(leftDrawerButton).should('not.be.visible')
      cy.get(rightDrawerButton).should('not.be.visible')
    })
  })

  context('mobile', () => {
    beforeEach(() => {
      cy.viewport('iphone-6')
    })

    it('calls the toggle functions when clicked', () => {
      cy.window().then((win) => {
        cy.spy(win.console, 'log').as('consoleLogSpy')
      })

      cy.get(leftDrawerButton).click()
      cy.get('@consoleLogSpy').should('be.calledWith', 'left drawer opened')

      cy.get(rightDrawerButton).click()
      cy.get('@consoleLogSpy').should('be.calledWith', 'right drawer opened')
    })
  })
})
