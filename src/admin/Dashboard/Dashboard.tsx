import * as React from 'react'
import { startOfToday } from 'date-fns'
import classnames from 'classnames'
import { ImportDataFromExcel } from './ImportDataFromExcel'
import './Dashboard.css'
import { Groups } from './Groups'
import { firestore } from '../firebase'
import {
  Booking,
  groupBookingsByTours,
  bookingId,
  totalPax,
  countPaxByTour,
} from '../../shared/types/Booking'
import { Group, GroupDocument } from '../../shared/types/Group'
import { Tour, TourDocument } from '../../shared/types/Tour'
import { PickUpLocation, PickUpLocationDocument } from '../../shared/types/PickUpLocation'
import { LinkTourModalButton } from './LinkTourModalButton'
import { Dropdown } from '../../shared/components/Dropdown/Dropdown'
import { LinkPickupLocModalButton } from './LinkPickupLocModalButton'
import { Collections } from '../../shared/constants'
import { EditBookingModalButton } from './EditBookingModalButton'
import { AddDriverModalButton } from './AddDriverModalButton'
import { AddBusModalButtonButton } from './AddBusModalButton'
import { AddTourModalButton } from './AddTourModalButton'
import { AddPickUpLocationModalButton } from './AddPickUpLocationModalButton'

type DashboardProps = {}

const initialState = {
  chosenDate: process.env.NODE_ENV === 'development' ? new Date('2018-09-25') : startOfToday(),
  bookings: [] as Booking[],
  groups: [] as Group[],
  tours: [] as Tour[],
  pickUpLocations: [] as PickUpLocation[],
}
type DashboardState = Readonly<typeof initialState>

export class Dashboard extends React.PureComponent<DashboardProps, DashboardState> {
  readonly state: DashboardState = initialState
  cancelBookingsSnapshots: () => void = () => {}
  cancelGroupsSnapshots: () => void = () => {}
  cancelToursSubscriptions: () => void = () => {}
  cancelPickupLocationSubscription: () => void = () => {}

  componentDidMount() {
    this.cancelBookingsSnapshots = this.createBookingsSubcription()
    this.cancelGroupsSnapshots = this.createGroupsSubscription()
    this.cancelToursSubscriptions = this.createToursSubscription()
    this.cancelPickupLocationSubscription = this.createPickUpLocationsSubscription()
  }

  componentDidUpdate(_prevProps: DashboardProps, prevState: DashboardState) {
    if (this.state.chosenDate !== prevState.chosenDate) {
      this.cancelBookingsSnapshots()
      this.cancelBookingsSnapshots = this.createBookingsSubcription()
      this.cancelGroupsSnapshots()
      this.cancelGroupsSnapshots = this.createGroupsSubscription()
    }
  }

  componentWillUnmount() {
    this.cancelBookingsSnapshots()
    this.cancelGroupsSnapshots()
    this.cancelToursSubscriptions()
    this.cancelPickupLocationSubscription()
  }

  render() {
    console.log('Dashboard render', this.state)
    const bookingsByTour = groupBookingsByTours(this.state.bookings)
    const numberOfBookingsNotInGroup = this.state.bookings.filter(i => i.groupId === null).length
    return (
      <main className="dashboard">
        <div className="header-row">
          <h1>
            Bookings for{' '}
            {this.state.chosenDate.toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h1>
          <ImportDataFromExcel
            pickUpLocations={this.state.pickUpLocations}
            tours={this.state.tours}
          />
        </div>
        <div className="date-row">
          <label>
            Change date
            <input
              type="date"
              value={this.state.chosenDate.toISOString().split('T')[0]}
              onChange={event => {
                const newValue = event.target.value
                this.setState(() => ({ chosenDate: new Date(newValue) }))
              }}
            />
          </label>
          <AddDriverModalButton />
          <AddBusModalButtonButton />
          <AddTourModalButton />
          <AddPickUpLocationModalButton />
        </div>
        <Groups
          date={this.state.chosenDate}
          groups={this.state.groups}
          bookings={this.state.bookings}
          tours={this.state.tours}
        />
        <div className={classnames('number-of-ungrouped-row', {
          isZero: numberOfBookingsNotInGroup === 0,
        })}>
          <span>{`${numberOfBookingsNotInGroup} bookings ungrouped`}</span>
        </div>
        {bookingsByTour.map(g => {
          const tour = this.state.tours.find(i => i.id === g.tourId)
          return (
            <div key={g.tourName}>
              <Dropdown
                buttonInlineStyle={
                  g.tourId !== undefined
                    ? {
                        textDecoration: 'underline',
                        textDecorationColor: tour && tour.color,
                      }
                    : {}
                }
                btnLabel={g.tourName}
                headerAside={
                  <div className="dropdownAside">
                    {g.tourId === undefined && (
                      <LinkTourModalButton synonym={g.tourName} tours={this.state.tours} />
                    )}
                    <span className="paxCount">{countPaxByTour(g)} PAX</span>
                  </div>
                }
              >
                {g.bookingsByPickUps.map(pickup => {
                  const allWithSameGroupValue = pickup.bookings
                    .map(i => i.groupId)
                    .every(i => i === pickup.bookings[0].groupId)
                  const allInGroups = pickup.bookings.every(i => i.groupId !== null)
                  return (
                    <div
                      key={pickup.pickUpName}
                      className={classnames('pickUpContainer', {
                        allInGroups: allInGroups,
                      })}
                    >
                      <div className="pickupHeader">
                        <h3>{pickup.pickUpName}</h3>
                        {pickup.pickUpId === undefined && (
                          <LinkPickupLocModalButton
                            synonym={pickup.pickUpName}
                            pickupLocations={this.state.pickUpLocations}
                          />
                        )}
                        <span>{totalPax(pickup.bookings)} PAX</span>
                        {allWithSameGroupValue && (
                          <select
                            value={pickup.bookings[0].groupId || ''}
                            onChange={event => {
                              const newGroupId = event.target.value || null
                              const batch = firestore.batch()
                              pickup.bookings.forEach(b => {
                                const id = bookingId(b)
                                const bookingUpdate: Partial<Booking> = {
                                  groupId: newGroupId,
                                }
                                console.log({ bookingUpdate })
                                batch.update(
                                  firestore.collection('bookings').doc(id),
                                  bookingUpdate,
                                )
                              })

                              batch.commit().then(() => console.log('pickup loc updated'))
                            }}
                          >
                            <option value=""> - Choose pickup group - </option>
                            {this.state.groups.map(g => (
                              <option key={g.id} value={g.id}>
                                #{g.friendlyKey} - {g.driver ? g.driver.name : '    '} -{' '}
                                {g.bus ? g.bus.name : '    '}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                      <table>
                        <tbody>
                          {pickup.bookings.map(b => (
                            <tr
                              key={b.import.bookingRef}
                              className={classnames({
                                noGroupAssigned: b.groupId === null,
                              })}
                            >
                              <td>
                                <EditBookingModalButton
                                  pickupLocations={this.state.pickUpLocations}
                                  booking={b}
                                />
                              </td>
                              <td>{b.mainContact}</td>
                              <td>{b.pax}</td>
                              <td>{b.import.seller}</td>
                              <td>{b.paymentStatus}</td>
                              <td>
                                <select
                                  value={b.groupId || ''}
                                  onChange={event => {
                                    const newGroupId = event.target.value || null
                                    const bookingUpdate: Partial<Booking> = {
                                      groupId: newGroupId,
                                    }
                                    const id = bookingId(b)
                                    firestore
                                      .collection(Collections.Bookings)
                                      .doc(id)
                                      .update(bookingUpdate)
                                      .then(() => console.log('pickup loc updated'))
                                  }}
                                >
                                  <option value=""> - Choose pickup group - </option>
                                  {this.state.groups.map(g => (
                                    <option key={g.id} value={g.id}>
                                      #{g.friendlyKey} - {g.driver ? g.driver.name : '    '} -{' '}
                                      {g.bus ? g.bus.name : '    '}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                })}
              </Dropdown>
            </div>
          )
        })}
      </main>
    )
  }

  createGroupsSubscription = () =>
    firestore
      .collection(Collections.Groups)
      .where('date', '==', this.state.chosenDate)
      .orderBy('friendlyKey', 'asc')
      .onSnapshot(s => {
        const groups = s.docs.map<Group>(g => ({
          id: g.id,
          ...(g.data() as GroupDocument),
          date: g.data().date.toDate(),
        }))
        console.log('fetched groups', groups)
        this.setState(() => ({ groups }))
      })

  createBookingsSubcription = () =>
    firestore
      .collection(Collections.Bookings)
      .where('date', '==', this.state.chosenDate)
      .onSnapshot(s => {
        const bookings = s.docs.map<Booking>(b => ({
          ...(b.data() as Booking),
          date: b.data().date.toDate(),
        }))
        this.setState(() => ({ bookings }))
      })
  createToursSubscription = () =>
    firestore
      .collection(Collections.Tours)
      .orderBy('name', 'desc')
      .onSnapshot(s => {
        const tours = s.docs.map<Tour>(t => ({
          ...(t.data() as TourDocument),
          id: t.id,
        }))
        this.setState(() => ({ tours }))
      })
  createPickUpLocationsSubscription = () =>
    firestore.collection(Collections.PickupLocations).onSnapshot(s => {
      const pickUpLocations = s.docs.map<PickUpLocation>(t => ({
        ...(t.data() as PickUpLocationDocument),
        id: t.id,
      }))
      this.setState(() => ({ pickUpLocations }))
    })
}
