import * as React from 'react'
import { Link } from 'react-router-dom'
import classnames from 'classnames'
import './Button.css'

type ButtonStyle = 'raised' | 'action' | 'flat'

type ButtonProps = {
  onClick?: () => void
  disabled?: boolean
  lookLikeDisabled?: boolean
  color: 'default' | 'munsell' | 'white'
  style?: ButtonStyle
  type?: 'button' | 'submit'
  to?: string
  width?: 'fit-content'
  className?: string
  inputRef?: (ref: any) => void
}
export class Button extends React.PureComponent<ButtonProps> {
  render() {
    const style: ButtonStyle = this.props.style || 'raised'
    const className = classnames(
      this.props.className,
      'Button',
      this.props.color,
      `Style-${style}`,
      this.props.width,
      {
        Disabled: this.props.lookLikeDisabled || this.props.disabled,
      },
    )
    if (this.props.to) {
      return (
        <Link
          className={className}
          to={this.props.to}
          onClick={this.props.onClick}
        >
          {this.props.children}
        </Link>
      )
    }
    return (
      <button
        type={this.props.type || 'button'}
        disabled={this.props.disabled}
        onClick={this.props.onClick}
        className={className}
        ref={this.props.inputRef}
      >
        {this.props.children}
      </button>
    )
  }
}
