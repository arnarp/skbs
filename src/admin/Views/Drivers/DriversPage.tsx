import * as React from "react"
import "./DriversPage.css"
import { useDrivers } from "../../../shared/hooks/useDrivers";
import { EditDriverModalButton } from "./EditDriverModalButton";

export const DriversPage: React.SFC<{}> = () => {
  const drivers = useDrivers()
  return (
    <main className="DriversPage">
      <h1>Drivers</h1>
      <table>
        <thead>
          <tr>
            <th style={{ width: "40%", minWidth: "150px" }}>Name</th>
            <th style={{ width: "25%", minWidth: "125px" }}>Phone nr</th>
            <th style={{ width: "25%", minWidth: "125px" }} />
            <th style={{ width: "10%", minWidth: "50px" }} />
          </tr>
        </thead>
        <tbody>
          {drivers.map(d => (
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.phoneNumber}</td>
              <td />
              <td><EditDriverModalButton driver={d} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
