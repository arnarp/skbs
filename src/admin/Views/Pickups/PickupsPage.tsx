import * as React from 'react'
import { usePickups } from '../../../firebase/firestore/pickups'
import { AddPickUpLocationModalButton } from './AddPickUpLocationModalButton'
import { EditPickupModalButton } from './EditPickupModalButton'
import { DeletePickupModalButton } from './DeletePickupModalButton'
import { Helmet } from 'react-helmet'

export const PickupsPage = () => {
  return (
    <main>
      <Helmet>
        <title>Pickups</title>
      </Helmet>
      <PickupsPageContent />
    </main>
  )
}

const PickupsPageContent = () => {
  const pickups = usePickups()
  return (
    <React.Fragment>
      <h1>Pickup</h1>
      <AddPickUpLocationModalButton />
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{ width: '40%', minWidth: '200px' }}>Name</th>
            <th style={{ width: '40%', minWidth: '200px' }}>Links</th>
            <th style={{ width: '10%', minWidth: '50px' }} />
            <th style={{ width: '10%', minWidth: '50px' }} />
          </tr>
        </thead>
        <tbody>
          {pickups.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>
                {p.synonyms.map(s => (
                  <span style={{ display: 'block' }} key={s}>
                    {s}
                  </span>
                ))}
              </td>
              <td>
                <EditPickupModalButton pickup={p} />
              </td>
              <td>
                <DeletePickupModalButton pickup={p} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  )
}
