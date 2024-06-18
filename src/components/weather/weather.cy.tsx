import { supportedViewports } from '../../../cypress/support/variables'
import Weather from './weather'

describe('Weather', () => {
  const currentTemp = '[data-cy=current-temp]'

  const weatherData = {
    weather: [
      {
        timestamp: 1705440787,
        temp: {
          low: -0.93,
          high: 1.23,
          current: 0.6,
        },
        weatherIcon: {
          description: 'broken clouds',
          icon: 'https://openweathermap.org/img/wn/04d.png',
        },
      },
      {
        timestamp: 1705521600,
        temp: {
          low: -3.93,
          high: 1.23,
        },
        weatherIcon: {
          description: 'snow',
          icon: 'https://openweathermap.org/img/wn/13d.png',
        },
      },
      {
        timestamp: 1705608000,
        temp: {
          low: -0.93,
          high: 4.23,
        },
        weatherIcon: {
          description: 'light rain',
          icon: 'https://openweathermap.org/img/wn/10d.png',
        },
      },
      {
        timestamp: 1705694400,
        temp: {
          low: 2.93,
          high: 1.23,
        },
        weatherIcon: {
          description: 'broken clouds',
          icon: 'https://openweathermap.org/img/wn/04d.png',
        },
      },
      {
        timestamp: 1705780800,
        temp: {
          low: 1.93,
          high: 10.23,
        },
        weatherIcon: {
          description: 'broken clouds',
          icon: 'https://openweathermap.org/img/wn/04d.png',
        },
      },
      {
        timestamp: 1705867200,
        temp: {
          low: -0.93,
          high: 1.23,
        },
        weatherIcon: {
          description: 'broken clouds',
          icon: 'https://openweathermap.org/img/wn/04d.png',
        },
      },
      {
        timestamp: 1705953600,
        temp: {
          low: -1.93,
          high: 3.23,
        },
        weatherIcon: {
          description: 'light rain',
          icon: 'https://openweathermap.org/img/wn/10d.png',
        },
      },
      {
        timestamp: 1706040000,
        temp: {
          low: 1.93,
          high: 2.23,
        },
        weatherIcon: {
          description: 'broken clouds',
          icon: 'https://openweathermap.org/img/wn/04d.png',
        },
      },
    ],
    location: 'New York',
    units: 'metric',
    weatherProvider: 'Your Weather Provider',
  }

  beforeEach(() => {
    cy.mount(
      <Weather
        weather={weatherData.weather}
        location={weatherData.location}
        units="metric"
      />
    )
  })

  supportedViewports.forEach((viewport) => {
    it(`renders the weather component on ${viewport} screen`, () => {
      cy.get('[data-cy=location]').should('be.visible')
      cy.get('[data-cy=current-temp]').should('be.visible')
      cy.get('[data-cy=current-weather-description]').should('be.visible')
      cy.get('[data-cy=daily-weather-card]').should('have.length.above', 0)
    })

    it(`switches between the units properly on ${viewport} screen`, () => {
      const imperialTemp = Math.round(
        // celsius to fahrenheit -> °F = °C * (9/5) + 32
        // eslint-disable-next-line no-magic-numbers
        weatherData.weather[0].temp.current! * (9 / 5) + 32
      )

      cy.get('[data-cy=current-temp]').should(
        'contain',
        Math.round(weatherData.weather[0].temp.current!)
      )
      cy.get('[data-cy=menu-icon-button]').click()
      cy.get('li').last().should('contain', 'Fahrenheit').click()
      cy.get(currentTemp).should('contain', imperialTemp)
    })
  })
})
