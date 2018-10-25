import * as React from 'react'
import { Driver } from '../../../shared/types/Driver';

type Props = {
  
}
type State = Readonly<{
  drivers: Driver[]
}>

const initialState: State = {
  drivers: []
}

export class Drivers extends React.Component<Props, State> {
  readonly state: State = initialState;

  render() {
    return (
      <main>
        <h1>Drivers</h1>
      </main>
    )
  }
}
