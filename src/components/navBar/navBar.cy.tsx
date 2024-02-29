import BookmarkIcon from '@mui/icons-material/Bookmark'
import MessageIcon from '@mui/icons-material/Message'

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

  beforeEach(() => {
    cy.mount(
      <NavBar
        logo={<Logo />}
        leftDrawerIcon={<BookmarkIcon />}
        rightDrawerIcon={<MessageIcon />}
        leftDrawerAriaLabel="open left drawer"
        rightDrawerAriaLabel="open right drawer"
        handleLeftDrawerToggle={openLeftDrawer}
        handleRightDrawerToggle={openRightDrawer}
      />
    )
  })

  it('renders the nav bar', () => {
    cy.get(navBar).should('be.visible')
  })

  it('does not render the left and right drawer buttons on screens larger than 900px', () => {
    const viewportWidth = 901
    const viewportHeight = 600

    cy.viewport(viewportWidth, viewportHeight)
    cy.get(leftDrawerButton).should('not.be.visible')
    cy.get(rightDrawerButton).should('not.be.visible')
  })

  it('calls the toggle functions when clicked', () => {
    cy.viewport('iphone-6')
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLogSpy')
    })

    cy.get(leftDrawerButton).click()
    cy.get('@consoleLogSpy').should('be.calledWith', 'left drawer opened')

    cy.get(rightDrawerButton).click()
    cy.get('@consoleLogSpy').should('be.calledWith', 'right drawer opened')
  })
})
