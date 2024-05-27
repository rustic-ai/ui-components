import Typography from '@mui/material/Typography'
import React from 'react'

import { formatMessageTimestamp } from '../helper'

export interface TimestampProps {
  /** Timestamp in ISO 8601 format. */
  timestamp: string
}

const Timestamp = (props: TimestampProps) => {
  return (
    <Typography
      variant="caption"
      color="textSecondary"
      className="rustic-timestamp"
    >
      {formatMessageTimestamp(props.timestamp)}
    </Typography>
  )
}

export default Timestamp
