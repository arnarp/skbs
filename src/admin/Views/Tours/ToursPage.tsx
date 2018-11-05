import * as React from "react"
import { useTours } from "../../../firebase/firestore/tours"
import { AddTourModalButton } from "../Dashboard/AddTourModalButton"
import { EditTourModalButton } from "./EditTourModalButton"
import { DeleteTourModalButton } from "./DeleteTourModalButton"

export const ToursPage = () => {
  const pickups = useTours()
  return (
    <main>
      <h1>Tours</h1>
      <AddTourModalButton />
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: "40%", minWidth: "200px" }}>Name</th>
            <th style={{ width: "40%", minWidth: "200px" }}>Links</th>
            <th style={{ width: "10%", minWidth: "50px" }} />
            <th style={{ width: "10%", minWidth: "50px" }} />
          </tr>
        </thead>
        <tbody>
          {pickups.map(i => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>
                {i.synonyms.map(s => (
                  <span style={{ display: "block" }} key={s}>
                    {s}
                  </span>
                ))}
              </td>
              <td>
                <EditTourModalButton tour={i} />
              </td>
              <td>
                <DeleteTourModalButton tour={i} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
