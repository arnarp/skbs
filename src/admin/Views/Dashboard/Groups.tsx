import * as React from "react"
import { Link } from "react-router-dom"
import "./Groups.css"
import { Button } from "../../../shared/components/Button"
import { firestore } from "../../../firebase"
import { GroupDocument, Group } from "../../../shared/types/Group"
import {
  Booking,
  groupBookinsByPickUp,
  totalPax,
  toursInBookings,
} from "../../../shared/types/Booking"
import { Tour } from "../../../shared/types/Tour"
import { useDrivers } from "../../../firebase/firestore/drivers"
import { useVehicles } from "../../../firebase/firestore/vehicles"

type GroupsProps = {
  date: Date
  groups: Group[]
  bookings: Booking[]
  tours: Tour[]
}

export const Groups: React.SFC<GroupsProps> = ({
  date,
  groups,
  bookings,
  tours,
}) => {
  const addGroupBtn = React.useRef<HTMLButtonElement>()
  const drivers = useDrivers()
  const vehicles = useVehicles()

  const addGroup = () => {
    const newGroupDoc: GroupDocument = {
      date: date,
      friendlyKey: groups.length + 1,
    }
    firestore
      .collection("groups")
      .add(newGroupDoc)
      .then(() => {
        console.log("Saved group")
      })
  }

  return (
    <div className="groups">
      <h2>Groups</h2>
      <div className="groupsCol">
        {groups.map(g => {
          const bookingsForGroup = bookings.filter(b => b.groupId === g.id)
          const tourPax = bookingsForGroup.reduce(
            (acc, val) => {
              const tourId = val.tour === null ? "unknown" : val.tour.id
              if (acc[tourId] === undefined) {
                acc[tourId] = 0
              }
              acc[tourId] = acc[tourId] + val.pax
              return acc
            },
            {} as { [tourId: string]: number },
          )
          const colorPax =
            tours.length === 0
              ? []
              : Object.entries(tourPax).map(i => {
                  const tour = tours.find(t => t.id === i[0])
                  return {
                    color: tour === undefined ? "#24292eb3" : tour.color,
                    pax: i[1],
                  }
                })
          const byPickup = groupBookinsByPickUp(bookingsForGroup)
          const groupTotalPax = totalPax(bookingsForGroup)
          return (
            <div className="group" key={g.id}>
              <div className="groupHeader">
                <span className="friendlyKey">{g.friendlyKey}</span>
                <select
                  value={g.driver === undefined ? "" : g.driver.id}
                  onChange={event => {
                    const newGroupDriverId = event.target.value
                    console.log("onChange", { newGroupDriverId })
                    const newGroupDriver = drivers.find(
                      value => value.id === newGroupDriverId,
                    )
                    const groupUpdate: Partial<GroupDocument> = {
                      driver:
                        newGroupDriver === undefined
                          ? undefined
                          : {
                              id: newGroupDriver.id,
                              name: newGroupDriver.name,
                            },
                    }
                    firestore
                      .collection("groups")
                      .doc(g.id)
                      .update(groupUpdate)
                  }}
                >
                  <option value=""> - Select driver - </option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <select
                  value={g.bus === undefined ? "" : g.bus.id}
                  onChange={event => {
                    const newGroupBusId = event.target.value
                    const newGroupBus = vehicles.find(
                      value => value.id === newGroupBusId,
                    )
                    const groupUpdate: Partial<GroupDocument> = {
                      bus:
                        newGroupBus === undefined
                          ? undefined
                          : {
                              id: newGroupBus.id,
                              name: newGroupBus.name,
                            },
                      maxPax: newGroupBus ? newGroupBus.maxPax : undefined,
                    }
                    firestore
                      .collection("groups")
                      .doc(g.id)
                      .update(groupUpdate)
                  }}
                >
                  <option value=""> - Select vehicle - </option>
                  {vehicles.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <div className="ratio">
                  {colorPax.map(i => (
                    <div
                      id={`${i.color}_${i.pax}`}
                      key={i.color}
                      style={{
                        backgroundColor: i.color,
                        width: `${(100 * i.pax) / (g.maxPax || groupTotalPax)}px`,
                      }}
                    />
                  ))}
                </div>
                <span>
                  {groupTotalPax}/{g.maxPax || "?"}
                </span>
                <Link to={`/group/${g.id}`}>Print</Link>
              </div>
              <div className="groupContent">
                <p>Tours: {toursInBookings(bookingsForGroup).join(", ")}</p>
                <ul>
                  {byPickup.map(p => (
                    <li key={p.pickUpName}>
                      {p.pickUpName} {totalPax(p.bookings)} PAX
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
      <div className="buttonsRow">
        <Button
          color="default"
          ref={addGroupBtn}
          onClick={addGroup}
        >
          Add group
        </Button>
      </div>
    </div>
  )
}
