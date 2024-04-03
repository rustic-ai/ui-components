import { addons } from '@storybook/manager-api'
import rusticTheme from './rusticTheme'
import '../src/cookiebot.css'

addons.setConfig({
  theme: rusticTheme,
})
