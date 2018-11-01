import * as React from "react"
import { IconProps } from "./IconProps";
import './icons.css'
import classnames = require("classnames");


export const DeleteIcon: React.SFC<IconProps> = props => (
  <svg viewBox="0 0 64 64"
  className={classnames('Svg', `Stroke-${props.color}`, `Size-${props.size}`, props.className)}>
    <path
      data-name="layer2"
      fill="none"
      stroke-miterlimit="10"
      stroke-width="2"
      d="M54 12v50H10V12m-6 0h56m-40 0V2h24v10"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
    <path
      data-name="layer1"
      fill="none"
      stroke-miterlimit="10"
      stroke-width="2"
      d="M32 22v30M22 22v30m20-30v30"
      stroke-linejoin="round"
      stroke-linecap="round"
    />
  </svg>
)
