import './icon.css'

import React from 'react'

type IconProps = {
  name: string
  className?: string
}
export default function Icon(props: IconProps) {
  const dataCyPrefix = props.name.replaceAll('_', '-')

  return (
    <span
      className={`${props.className ? props.className + ' ' : ''}material-symbols-rounded`}
      data-cy={`${dataCyPrefix}-icon`}
    >
      {props.name}
    </span>
  )
}
