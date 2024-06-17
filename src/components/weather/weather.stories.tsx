import Weather from './weather'

export default {
  title: 'Rustic UI/Weather/Weather',
  component: Weather,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
}

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

export const Default = {
  args: {
    ...weatherData,
  },
}
