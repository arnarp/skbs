import * as React from "react"
import classnames from "classnames"
import "./Button.css"

type ButtonStyle = "raised" | "action" | "flat"

type ButtonProps = {
  onClick?: () => void
  disabled?: boolean
  lookLikeDisabled?: boolean
  color: "default" | "munsell" | "white"
  style?: ButtonStyle
  type?: "button" | "submit"
  // to?: string
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
      style = "raised",
      type = "button",
    },
    ref,
  ) => {
    // const style: ButtonStyle = this.props.style || "raised"
    // if (this.props.to) {
    //   return (
    //     <Link
    //       className={className}
    //       to={this.props.to}
    //       onClick={this.props.onClick}
    //     >
    //       {this.props.children}
    //     </Link>
    //   )
    // }
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={classnames(
          className,
          "Button",
          color,
          `Style-${style}`,
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
