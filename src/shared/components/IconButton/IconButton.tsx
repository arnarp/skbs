import * as React from "react"
import "./IconButton.css"

type Props = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const IconButton = React.forwardRef<HTMLButtonElement, Props>(
  (props, ref) => {
    return (
      <button className="IconButton" ref={ref} onClick={props.onClick}>
        {props.children}
      </button>
    )
  },
)
