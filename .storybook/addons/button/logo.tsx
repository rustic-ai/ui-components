import { addons } from '@storybook/manager-api'

const logoDataAttribute = 'data-storybook-logo-id'
const logoId = 'storybook-sidebar-custom-logo'
const navSelector = 'nav'
const scrollContainerSelector = 'nav > div'

const initialCheckInterval = 100
const uiSettleTimeout = 300

const logoBottomPosition = 15
const logoHeight = 20
const bottomPadding = 10
const maxLogoWidthPercent = 80

const logoUrl = '/images/dragonscale-logo.svg'
const websiteUrl = 'https://www.dragonscale.ai'

const addLogoToSidebar = () => {
  const sidebar = document.querySelector(navSelector)
  if (!sidebar) {
    return false
  }

  const existingLogo = sidebar.querySelector(
    `[${logoDataAttribute}="${logoId}"]`
  )
  if (existingLogo) {
    ;(existingLogo as HTMLElement).style.display = 'flex'
    return true
  }

  const logoContainer = document.createElement('div')
  logoContainer.setAttribute(logoDataAttribute, logoId)
  logoContainer.style.cssText = `
        position: absolute;
        bottom: ${logoBottomPosition}px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: ${bottomPadding}px;
        z-index: 1;
        pointer-events: auto;
    `

  const logo = document.createElement('img')
  logo.src = window.location.origin + logoUrl
  logo.alt = 'Build by Dragonscale'
  logo.style.cssText = `
        max-width: ${maxLogoWidthPercent}%;
        height: ${logoHeight}px;
        cursor: pointer;
    `

  logo.onclick = () => {
    window.open(websiteUrl, '_blank')
  }

  logoContainer.appendChild(logo)
  sidebar.appendChild(logoContainer)

  const scrollContainer = document.querySelector(
    scrollContainerSelector
  ) as HTMLElement
  if (scrollContainer) {
    const logoHeight = logoContainer.offsetHeight
    scrollContainer.style.paddingBottom = `${logoHeight + bottomPadding}px`
  }

  return true
}

const init = () => {
  const checkInterval = setInterval(() => {
    if (addLogoToSidebar()) {
      clearInterval(checkInterval)

      const bodyObserver = new MutationObserver(() => {
        addLogoToSidebar()
      })

      bodyObserver.observe(document.body, {
        childList: true,
        subtree: true,
      })

      window.addEventListener('resize', () => {
        setTimeout(() => {
          addLogoToSidebar()

          const sidebar = document.querySelector(navSelector)
          const logoContainer = sidebar?.querySelector(
            `[${logoDataAttribute}="${logoId}"]`
          )
          const scrollContainer = document.querySelector(
            scrollContainerSelector
          ) as HTMLElement

          if (scrollContainer && logoContainer) {
            const currentLogoHeight = (logoContainer as HTMLElement)
              .offsetHeight
            scrollContainer.style.paddingBottom = `${currentLogoHeight + bottomPadding}px`
          }
        }, uiSettleTimeout)
      })
    }
  }, initialCheckInterval)
}

addons.register('sidebar-logo', () => {
  init()
})
