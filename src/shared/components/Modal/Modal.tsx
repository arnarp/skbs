import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Transition } from 'react-transition-group'
import uuid from 'uuid/v4'
import classnames from 'classnames'
import { Button } from '../Button'
import './Modal.css'

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
  h2: HTMLHeadingElement
  closeButton: any
  constructor(props) {
    super(props)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.headingId = uuid()
  }

  componentDidUpdate(prevProps) {
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

  /**
   * @param {KeyboardEvent} ev
   */
  onKeyDown(ev) {
    if (ev.key === 'Escape') {
      this.props.onClose()
    }
  }

  onOpen() {
    this.h2.focus()
    document.addEventListener('keydown', this.onKeyDown)
    document.getElementById('root').inert = true
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
  }
  onClose() {
    this.cleanup()
    this.props.focusAfterClose()
  }

  cleanup() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.getElementById('root').inert = false
    document.body.style.overflow = 'visible'
    document.body.style.position = 'static'
  }

  render() {
    const { show, header, onClose, children, contentClassName } = this.props
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
              className={classnames('dialog', state)}
              role="dialog"
              onClick={onClose}
            >
              <div className={'modal'} onClick={e => e.stopPropagation()}>
                <div className={'header'}>
                  <h2
                    id={this.headingId}
                    tabIndex={-1}
                    ref={el => (this.h2 = el)}
                    style={{ opacity: this.props.hideHeader ? 0 : 1 }}
                  >
                    {header}
                  </h2>
                  <Button
                    inputRef={ref => {
                      this.closeButton = ref
                    }}
                    onClick={onClose}
                    color="default"
                    style="flat"
                  >
                    Loka
                  </Button>
                </div>
                <div className={classnames('content', contentClassName)}>
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

  static defaultProps = { hideHeader: false }
}
