import * as React from 'react';
import { useVehicles } from '../../../firebase/firestore/vehicles';
import { AddVehicleModalButtonButton } from './AddVehicleModalButton';
import { EditVehicleModalButton } from './EditVehicleModalButton';
import { DeleteVehicleModalButton } from './DeleteVehicleModalButton';

export const VehiclesPage: React.SFC<{}> = () => {
  const vehicles = useVehicles()
  return (
    <main className="VehiclesPage">
      <h1>Vehicles</h1>
      <AddVehicleModalButtonButton />
      <table>
        <thead>
          <tr>
            <th style={{ width: "40%", minWidth: "150px" }}>Name</th>
            <th style={{ width: "20%", minWidth: "50px" }}>Max pax</th>
            <th style={{ width: "10%", minWidth: "40px" }}></th>
            <th style={{ width: "10%", minWidth: "40px" }}></th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>{v.maxPax}</td>
              <td><EditVehicleModalButton vehicle={v} /></td>
              <td><DeleteVehicleModalButton vehicle={v} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
