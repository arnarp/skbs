import * as React from "react"
import { IconProps } from "./IconProps"
import "./icons.css"
import classnames = require("classnames")

export const DeleteIcon: React.SFC<IconProps> = props => (
  <svg
    viewBox="0 0 64 64"
    className={classnames(
      "Svg",
      `Stroke-${props.color}`,
      `Size-${props.size}`,
      props.className,
    )}
  >
    <path
      fill="none"
      strokeMiterlimit="10"
      strokeWidth="2"
      d="M54 12v50H10V12m-6 0h56m-40 0V2h24v10"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path
      fill="none"
      strokeMiterlimit="10"
      strokeWidth="2"
      d="M32 22v30M22 22v30m20-30v30"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
)
