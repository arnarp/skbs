import * as React from 'react'
import { ExcelReader } from './ExcelReader'

type DashboardProps = {}

const initialState = {}
type DashboardState = Readonly<typeof initialState>

export class Dashboard extends React.PureComponent<
  DashboardProps,
  DashboardState
> {
  readonly state: DashboardState = initialState

  render() {
    return (
      <main>
        <h1>Dashboard</h1>
        <ExcelReader />
      </main>
    )
  }
}
