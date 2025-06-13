import { addons } from '@storybook/manager-api'

const logoDataAttribute = 'data-storybook-logo-id'
const logoId = 'storybook-sidebar-custom-logo'
const navSelector = 'nav'
const scrollContainerSelector = 'nav > div'
const scrollContainerPaddingClass = 'storybook-scroll-padding'

const initialCheckInterval = 100
const uiSettleTimeout = 300

const bottomPadding = 10

const logoUrl = 'images/dragonscale-logo.svg'
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
  logoContainer.className = 'storybook-logo-container'

  const logo = document.createElement('img')
  logo.src = logoUrl
  logo.alt = 'Build by Dragonscale'
  logo.className = 'storybook-logo-image'

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
    scrollContainer.classList.add(scrollContainerPaddingClass)
    document.documentElement.style.setProperty(
      '--scroll-padding-bottom',
      `${logoHeight + bottomPadding}px`
    )
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
            document.documentElement.style.setProperty(
              '--scroll-padding-bottom',
              `${currentLogoHeight + bottomPadding}px`
            )
          }
        }, uiSettleTimeout)
      })
    }
  }, initialCheckInterval)
}

addons.register('sidebar-logo', () => {
  init()
})
