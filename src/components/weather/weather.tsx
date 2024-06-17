import './weather.css'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import React from 'react'

import { getDayFromUnixTime } from '../helper'
import Icon from '../icon/icon'
import type { WeatherProps } from '../types'

/** The `Weather` component provides a detailed daily weather forecast for a given location, displaying the current temperature, weather description, today's date with high and low temperatures, and a card for each day's forecast showing the day of the week, weather icon, and high and low temperatures, all while attributing the weather data provider.

Note: The first item in the `Weather` array is presumed to be the current day's weather.
 */
export default function Weather(props: WeatherProps) {
  const getTempSymbol = (units: string) => {
    switch (units) {
      case 'imperial':
        return 'F'
      case 'metric':
        return 'C'
    }
  }

  const formatTemperature = (temp: number) => {
    return Math.round(temp)
  }

  const millisecondsConversion = 1000
  const dateStringFromTimestamp = new Date(
    props.weather[0].timestamp * millisecondsConversion
  )
  const day = getDayFromUnixTime(props.weather[0].timestamp).shortName
  const date = dateStringFromTimestamp.getDate()
  const lastTwoDigits = 2
  const year = dateStringFromTimestamp
    .getFullYear()
    .toString()
    .slice(lastTwoDigits)

  const formattedDateToday = `${day} ${date}/${year}`
  const formattedWeatherToday = `HIGH: ${formatTemperature(props.weather[0].temp.high)} / LOW: ${formatTemperature(props.weather[0].temp.high)}`

  return (
    <Card variant="outlined" className="rustic-weather">
      <Stack alignItems="center">
        <Typography variant="h4" component="span" data-cy="location">
          {props.location}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          className="rustic-current-weather-description"
          data-cy="current-weather-description"
        >
          <img src={props.weather[0].weatherIcon.icon} alt="" />
          <Typography variant="caption">
            {props.weather[0].weatherIcon.description}
          </Typography>
        </Stack>
        {props.weather[0].temp.current && (
          <Typography
            variant="h1"
            component="span"
            data-cy="current-temp"
            className="rustic-current-temp"
          >
            {formatTemperature(props.weather[0].temp.current)}°
            {getTempSymbol(props.units)}
          </Typography>
        )}
        <Stack direction="row" spacing={2}>
          <Typography variant="overline">{formattedDateToday}</Typography>
          <Typography variant="overline">{formattedWeatherToday}</Typography>
        </Stack>
      </Stack>

      <Box className="rustic-daily-weather-container">
        {props.weather.map((weatherPreview, i) => {
          if (i !== 0) {
            return (
              <Card
                variant="outlined"
                key={i}
                className="rustic-daily-weather-card"
                data-cy="daily-weather-card"
              >
                <Typography
                  variant="h5"
                  component="span"
                  color="text.secondary"
                  aria-label={
                    getDayFromUnixTime(weatherPreview.timestamp).fullName
                  }
                >
                  {getDayFromUnixTime(weatherPreview.timestamp).shortName}
                </Typography>
                <img
                  src={weatherPreview.weatherIcon.icon}
                  alt={weatherPreview.weatherIcon.description}
                />
                <Typography variant="caption" color="text.secondary">
                  High: {formatTemperature(weatherPreview.temp.high)}°
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Low: {formatTemperature(weatherPreview.temp.low)}°
                </Typography>
              </Card>
            )
          }
        })}
      </Box>

      {props.weatherProvider && (
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
          alignSelf="center"
          className="rustic-weather-attribution"
        >
          <Icon name="cloud" />
          <Typography variant="caption">
            {`Weather data provided by ${props.weatherProvider}`}
          </Typography>
        </Stack>
      )}
    </Card>
  )
}
