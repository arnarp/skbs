import * as React from 'react'
import { ImportDataFromExcel } from './ImportDataFromExcel'
import './Dashboard.css'
import { Groups } from './Groups'

type DashboardProps = {}

const initialState = {
  chosenDate: new Date('2018-09-25'),
}
type DashboardState = Readonly<typeof initialState>

export class Dashboard extends React.PureComponent<
  DashboardProps,
  DashboardState
> {
  readonly state: DashboardState = initialState

  render() {
    return (
      <main className="dashboard">
        <div className="header-row">
          <h1>Dashboard</h1>
          <ImportDataFromExcel />
        </div>
        <h2>
          Bookings for{' '}
          {this.state.chosenDate.toLocaleDateString('en-GB', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h2>
        <label>
          Change date
          <input
            type="date"
            value={this.state.chosenDate.toISOString().split('T')[0]}
            onChange={event => {
              const newValue = event.target.value
              console.log(newValue)
            }}
          />
        </label>
        <Groups date={this.state.chosenDate} />
      </main>
    )
  }
}
