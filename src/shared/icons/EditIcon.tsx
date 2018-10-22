import * as React from 'react'
import classnames from 'classnames'
import { IconProps } from './IconProps'
import './icons.css'

export const EditIcon: React.SFC<IconProps> = props => (
  <svg viewBox="0 0 64 64"
  className={classnames('Svg', `Fill-${props.color}`, `Size-${props.size}`, props.className)}
  >
    <path
      d="M54.368 17.674l6.275-6.267-8.026-8.025-6.274 6.267"
      strokeWidth="1"
      strokeMiterlimit="10"
      stroke="#202020"
      fill="none"
      data-name="layer2"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path
      d="M17.766 54.236l36.602-36.562-8.025-8.025L9.74 46.211 3.357 60.618l14.409-6.382zM9.74 46.211l8.026 8.025"
      strokeWidth="1"
      strokeMiterlimit="10"
      stroke="#202020"
      fill="none"
      data-name="layer1"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
)
