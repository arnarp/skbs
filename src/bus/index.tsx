import 'normalize.css'
import './index.css'
import 'wicg-inert'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { App } from './App/App'


ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
