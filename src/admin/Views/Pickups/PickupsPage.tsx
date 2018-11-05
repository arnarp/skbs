import * as React from 'react';
import { usePickups } from '../../../firebase/firestore/pickups';
import { AddPickUpLocationModalButton } from './AddPickUpLocationModalButton';
import { EditPickupModalButton } from './EditPickupModalButton';
import { DeletePickupModalButton } from './DeletePickupModalButton';

export const PickupsPage = () => {
  const pickups = usePickups()
  return (
    <main>
      <h1>Pickup</h1>
      <AddPickUpLocationModalButton />
      <table style={{width: '100%'}}>
        <thead>
          <tr>
            <th style={{ width: "40%", minWidth: "200px"}}>Name</th>
            <th style={{ width: "40%", minWidth: "200px"}}>Links</th>
            <th style={{ width: "10%", minWidth: "50px"}}></th>
            <th style={{ width: "10%", minWidth: "50px"}}></th>
          </tr>
        </thead>
        <tbody>
          {pickups.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>
                {p.synonyms.map(s => <span style={{display: 'block'}} key={s}>{s}</span>)}
              </td>
              <td><EditPickupModalButton pickup={p}/></td>
              <td><DeletePickupModalButton pickup={p} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
