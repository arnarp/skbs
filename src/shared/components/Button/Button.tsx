import * as React from "react"
import classnames from "classnames"
import "./Button.css"

type ButtonProps = {
  onClick?: () => void
  disabled?: boolean
  lookLikeDisabled?: boolean
  color: "default" | "munsell" | "white"
  type?: "button" | "submit"
  width?: "fit-content"
  className?: string
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      onClick,
      color,
      width,
      lookLikeDisabled,
      children,
      disabled,
      className,
      type = "button",
    },
    ref,
  ) => {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={classnames(
          className,
          "Button",
          color,
          width,
          {
            Disabled: lookLikeDisabled || disabled,
          },
        )}
        ref={ref}
      >
        {children}
      </button>
    )
  },
)
