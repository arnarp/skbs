import * as React from "react"
import * as ReactDOM from "react-dom"
import { Transition } from "react-transition-group"
import { v4 as uuid } from "uuid"
import classnames from "classnames"
import { Button } from "../Button"
import "./Modal.css"

type ModalProps = {
  /**
   * Controls if this modal is shown or not
   */
  show: boolean
  /**
   * Will be called on Esc key or when user clicks close button.
   * The component user is thus expected to toggle the show prop on
   * this event.
   */
  onClose: () => void
  /**
   * Will be called after show props flips to false. This component user is
   * expected to put focus back at correct place. Usually that element would
   * be the button that triggered this modal to be opened.
   */
  focusAfterClose: () => void
  header: string
  hideHeader: boolean
  contentClassName?: string
  fullscreen: boolean
}
const initialState = {}
type ModalState = Readonly<typeof initialState>

/**
 * Modal that is trying to be as simple as possible. When shown this modal children
 * will go through a react component lifecycle. That is if a component is passed in
 * as children / or somewhere in children, it will be mounted on show prop turning true
 * and it will be unmounted on show prop turning false.
 */
export class Modal extends React.PureComponent<ModalProps, ModalState> {
  headingId: string
  h2: HTMLHeadingElement | null = null
  closeButton = React.createRef<HTMLButtonElement>()
  constructor(props: ModalProps) {
    super(props)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.headingId = uuid()
  }

  componentDidUpdate(prevProps: ModalProps) {
    if (prevProps.show === false && this.props.show === true) {
      this.onOpen()
    }
    if (prevProps.show === true && this.props.show === false) {
      this.onClose()
    }
  }

  componentWillUnmount() {
    this.cleanup()
  }

  onKeyDown(ev: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent) {
    if (ev.key === "Escape") {
      this.props.onClose()
    }
  }

  onOpen() {
    this.h2 && this.h2.focus()
    document.addEventListener("keydown", this.onKeyDown)
    const root = document.getElementById("root")
    if (root !== null) {
      root.inert = true
    }
    document.body.style.overflow = "hidden"
  }
  onClose() {
    this.cleanup()
    this.props.focusAfterClose()
  }

  cleanup() {
    document.removeEventListener("keydown", this.onKeyDown)
    const root = document.getElementById("root")
    if (root !== null) {
      root.inert = false
    }
    document.body.style.overflow = "visible"
  }

  render() {
    const {
      show,
      header,
      onClose,
      children,
      contentClassName,
      fullscreen,
    } = this.props
    return (
      <Transition in={show} timeout={500} unmountOnExit mountOnEnter>
        {/*
          After show flips from false to true:
            Content will be mounted
            First render will be with state='exited'
            Second render, immediately after the first, will be with state='entering'
            Third render, about 500ms after second, will be with state='entered'
          After show flips from true to false:
            First render will be with state='entered'
            Second renderclassnamesimmediately after the first, will be with state='exiting'
            Third render, about 500ms after second, will be with state='exited'
            Then the content will be unmounted.
        */}
        {state =>
          ReactDOM.createPortal(
            <div
              onKeyDown={this.onKeyDown}
              aria-labelledby={this.headingId}
              className={classnames("dialog", state, {
                fullscreen: this.props.fullscreen,
              })}
              role="dialog"
              onClick={onClose}
            >
              <div className={"modal"} onClick={e => e.stopPropagation()}>
                <div className={"header"}>
                  <h2
                    id={this.headingId}
                    tabIndex={-1}
                    ref={el => (this.h2 = el)}
                    style={{ opacity: this.props.hideHeader ? 0 : 1 }}
                  >
                    {header}
                  </h2>
                  <Button
                    ref={this.closeButton}
                    onClick={onClose}
                    color="default"
                  >
                    {fullscreen ? "Close dialog" : "Close"}
                  </Button>
                </div>
                <div className={classnames("content", contentClassName)}>
                  {children}
                </div>
              </div>
            </div>,
            document.body,
          )
        }
      </Transition>
    )
  }

  static defaultProps = { hideHeader: false, fullscreen: false }
}
