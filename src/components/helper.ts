/* eslint-disable no-magic-numbers */
import pluralize from 'pluralize'

export function calculateTimeDiffInSeconds(isoDate: string): number {
  const currentDate = new Date()
  const convertedDate = new Date(isoDate)
  return Math.floor((currentDate.getTime() - convertedDate.getTime()) / 1000)
}

export function calculateTimeAgo(isoDate: string): string {
  const timeDifference = calculateTimeDiffInSeconds(isoDate)

  if (timeDifference < 60) {
    return `${pluralize('second', timeDifference, true)} ago`
  } else if (timeDifference < 3600) {
    const minutes = Math.floor(timeDifference / 60)
    return `${pluralize('minute', minutes, true)} ago`
  } else {
    const hours = Math.floor(timeDifference / 3600)
    return `${pluralize('hour', hours, true)} ago`
  }
}

export function formatDateAndTime(isoDateTimeInUtc: string): string {
  const convertedDate = new Date(isoDateTimeInUtc)
  const userLocale = navigator.language
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }

  const timeDifferenceInDays =
    calculateTimeDiffInSeconds(isoDateTimeInUtc) / (60 * 60 * 24)

  if (timeDifferenceInDays > 365) {
    options.year = 'numeric'
  }
  const formattedDateTime = convertedDate
    .toLocaleTimeString(userLocale, options)
    .replace(/,/g, '')
  return formattedDateTime
}

export function formatMessageTimestamp(isoDate: string): string {
  const timeDifference = calculateTimeDiffInSeconds(isoDate)

  return timeDifference < 86400
    ? calculateTimeAgo(isoDate)
    : formatDateAndTime(isoDate)
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export enum TimeFormat {
  HOUR,
  MONTH_DATE,
}

export function formatTimestamp(
  timestampInMillis: number,
  format: TimeFormat
): string {
  const date = new Date(timestampInMillis)

  let options = {}
  const userLocale = navigator.language

  if (format === TimeFormat.HOUR) {
    // example: 10:20 PM
    options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }
  } else {
    // example: Sep 25
    options = {
      month: 'short',
      day: 'numeric',
    }
  }

  return date.toLocaleString(userLocale, options)
}

export function calculateTimeDiffInDays(
  startTimestampInMillis: number,
  endTimestampInMillis: number
): number {
  const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  const startDate = new Date(startTimestampInMillis)
  const endDate = new Date(endTimestampInMillis)
  const differenceInDays = Math.round(
    Math.abs((endDate.getTime() - startDate.getTime()) / oneDay)
  )

  return differenceInDays
}

export function formatTimestampLabel(
  timestampInMillis: number,
  timeDiffInDays: number
) {
  if (timeDiffInDays <= 1) {
    return formatTimestamp(timestampInMillis, TimeFormat.HOUR)
  } else {
    return formatTimestamp(timestampInMillis, TimeFormat.MONTH_DATE)
  }
}

export function getSizeStyles(
  maybeWidth: number | undefined,
  maybeHeight: number | undefined
): { width?: number; height?: number; className?: string } {
  let stylingAttributes = {}

  if (maybeWidth) {
    stylingAttributes = {
      width: maybeWidth,
    }
  }
  if (maybeHeight) {
    stylingAttributes = {
      ...stylingAttributes,
      height: maybeHeight,
    }
  }
  if (!maybeWidth && !maybeHeight) {
    stylingAttributes = {
      className: 'rustic-fit-container',
    }
  }

  return stylingAttributes
}
