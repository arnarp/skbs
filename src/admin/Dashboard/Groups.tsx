import * as React from 'react'
import { Link } from 'react-router-dom'
import './Groups.css'
import { Button } from '../../shared/components/Button'
import { Driver } from '../../shared/types/Driver'
import { firestore } from '../firebase'
import { BusDocument, Bus } from '../../shared/types/Bus'
import { GroupDocument, Group } from '../../shared/types/Group'
import { AddDriverModalButton } from './AddDriverModalButton'
import { AddBusModalButtonButton } from './AddBusModalButton'
import { AddTourModalButton } from './AddTourModalButton'
import { AddPickUpLocationModalButton } from './AddPickUpLocationModalButton'
import { Booking, groupBookinsByPickUp, totalPax, toursInBookings } from '../../shared/types/Booking'
import { Tour } from '../../shared/types/Tour'

type GroupsProps = {
  date: Date
  groups: Group[]
  bookings: Booking[]
  tours: Tour[]
}

type GroupsState = Readonly<{
  drivers: Driver[]
  buses: Bus[]
}>
const initialState: GroupsState = {
  drivers: [],
  buses: [],
}

export class Groups extends React.PureComponent<GroupsProps, GroupsState> {
  readonly state: GroupsState = initialState
  addGroupBtn: HTMLButtonElement | undefined
  readonly subscriptions: Array<() => void> = []

  componentDidMount() {
    const driversSubcription = firestore
      .collection('drivers')
      .orderBy('name', 'desc')
      .onSnapshot(s => {
        const drivers = s.docs.map<Driver>(d => ({
          id: d.id,
          name: d.data().name,
        }))
        console.log('fetched drivers', drivers)
        this.setState(() => ({
          drivers,
        }))
      })
    this.subscriptions.push(driversSubcription)
    const busesSubscription = firestore
      .collection('buses')
      .orderBy('name', 'desc')
      .onSnapshot(s => {
        const buses = s.docs.map<Bus>(d => ({
          id: d.id,
          ...(d.data() as BusDocument),
        }))
        console.log('fetched buses', buses)
        this.setState(() => ({ buses }))
      })
    this.subscriptions.push(busesSubscription)
  }

  componentWillUnmount() {
    this.subscriptions.forEach(u => u())
  }

  render() {
    return (
      <div className="groups">
        <h2>Groups</h2>
        <div className="groupsCol">
          {this.props.groups.map(g => {
            const bookingsForGroup = this.props.bookings.filter(b => b.groupId === g.id)
            const tourPax = bookingsForGroup.reduce(
              (acc, val) => {
                const tourId = val.tour === null ? 'unknown' : val.tour.id
                if (acc[tourId] === undefined) {
                  acc[tourId] = 0
                }
                acc[tourId] = acc[tourId] + val.pax
                return acc
              },
              {} as { [tourId: string]: number },
            )
            const colorPax = this.props.tours.length === 0 ? [] : Object.entries(tourPax).map(i => {
              const tour = this.props.tours.find(t => t.id === i[0])
              return {
                color: tour === undefined ? '#24292eb3' : tour.color,
                pax: i[1],
              }
            })
            const byPickup = groupBookinsByPickUp(bookingsForGroup)
            console.log({ bookingsForGroup, tourPax, colorPax })
            return (
              <div className="group" key={g.id}>
                <div className="groupHeader">
                  <span className="friendlyKey">{g.friendlyKey}</span>
                  <select
                    value={g.driver === undefined ? '' : g.driver.id}
                    onChange={event => {
                      const newGroupDriverId = event.target.value
                      console.log('onChange', { newGroupDriverId })
                      const newGroupDriver = this.state.drivers.find(
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
                        .collection('groups')
                        .doc(g.id)
                        .update(groupUpdate)
                    }}
                  >
                    <option value=""> - Choose driver - </option>
                    {this.state.drivers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={g.bus === undefined ? '' : g.bus.id}
                    onChange={event => {
                      const newGroupBusId = event.target.value
                      const newGroupBus = this.state.buses.find(value => value.id === newGroupBusId)
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
                        .collection('groups')
                        .doc(g.id)
                        .update(groupUpdate)
                    }}
                  >
                    <option value=""> - Choose bus - </option>
                    {this.state.buses.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  <div className="ratio">
                    {colorPax.map(i => (
                      <div
                        key={i.color}
                        style={{
                          backgroundColor: i.color,
                          width: `${(100 * i.pax) / (g.maxPax || g.pax)}px`,
                        }}
                      />
                    ))}
                  </div>
                  <span>
                    {g.pax}/{g.maxPax || '?'}
                  </span>
                  <Link to={`/group/${g.id}`}>Print</Link>
                </div>
                <div className="groupContent">
                  <p>Tours: {toursInBookings(bookingsForGroup).join(', ')}</p>
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
          <AddDriverModalButton />
          <AddBusModalButtonButton />
          <AddTourModalButton />
          <AddPickUpLocationModalButton />
          <Button
            color="default"
            style="flat"
            inputRef={el => (this.addGroupBtn = el)}
            onClick={this.addGroup}
          >
            Add group
          </Button>
        </div>
      </div>
    )
  }
  private addGroup = () => {
    const newGroupDoc: GroupDocument = {
      date: this.props.date,
      pax: 0,
      friendlyKey: this.props.groups.length + 1,
    }
    firestore
      .collection('groups')
      .add(newGroupDoc)
      .then(() => {
        console.log('Saved group')
      })
  }
}
