import * as React from "react"
import { Driver } from "../../../shared/types/Driver"
import { subscribeOnDrivers } from "../../../firebase/firestore/drivers"
import "./DriversPage.css"

type Props = {}
type State = Readonly<{
  drivers: Driver[]
}>

const initialState: State = {
  drivers: [],
}

export class DriversPage extends React.Component<Props, State> {
  readonly state: State = initialState
  cancelDriversSubscription = () => {}

  componentDidMount() {
    this.cancelDriversSubscription = subscribeOnDrivers({}, drivers =>
      this.setState(() => ({ drivers })),
    )
  }

  render() {
    return (
      <main className="DriversPage">
        <h1>Drivers</h1>
        <table>
          <thead>
            <tr>
              <th style={{ width: "40%", minWidth: "150px" }}>Name</th>
              <th style={{ width: "25%", minWidth: "125px" }}>Phone nr</th>
              <th style={{ width: "25%", minWidth: "125px" }}></th>
              <th style={{ width: "10%", minWidth: "50px" }} />
            </tr>
          </thead>
          <tbody>
            {this.state.drivers.map(d => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>{d.phoneNumber}</td>
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    )
  }
}
