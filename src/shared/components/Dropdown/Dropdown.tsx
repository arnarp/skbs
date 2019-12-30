import * as React from 'react'
import { uuid } from "itils/dist/misc/uuid";
import './Dropdown.css'

type DropdownProps = {
  btnLabel: string
  buttonInlineStyle?: React.CSSProperties
  headerAside?: React.ReactNode
}
type DropdownState = Readonly<{
  open: boolean
}>

const initialState: DropdownState = {
  open: true,
}

export class Dropdown extends React.PureComponent<DropdownProps, DropdownState> {
  readonly state: DropdownState = initialState
  readonly panelId = uuid()
  readonly headingId = uuid()

  render() {
    return (
      <div className="dropdown">
        <div className="headerrow">
          <h2 id={this.headingId}>
            <button
              aria-controls={this.panelId}
              aria-expanded={this.state.open}
              style={this.props.buttonInlineStyle}
              onClick={() => this.setState(({ open }) => ({ open: !open }))}
            >
              {this.props.btnLabel}
            </button>
          </h2>
          {this.props.headerAside}
        </div>
        <div id={this.panelId} className="dropdownpanel" aria-labelledby={this.headingId}>
          {this.state.open && this.props.children}
        </div>
      </div>
    )
  }
}
