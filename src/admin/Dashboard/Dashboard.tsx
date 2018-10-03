import * as React from 'react'
import { ImportDataFromExcel } from './ImportDataFromExcel'
import './Dashboard.css'
import { Groups } from './Groups'
import { firestore } from '../firebase'
import {
  Booking,
  groupBookinsByPickUp,
  bookingId,
  totalPax,
} from '../../shared/types/Booking'
import { Group, GroupDocument } from '../../shared/types/Group'

type DashboardProps = {}

const initialState = {
  chosenDate: new Date('2018-09-25'),
  bookings: [] as Booking[],
  groups: [] as Group[],
}
type DashboardState = Readonly<typeof initialState>

export class Dashboard extends React.PureComponent<
  DashboardProps,
  DashboardState
> {
  readonly state: DashboardState = initialState
  cancelBookingsSnapshots: () => void = () => {}
  cancelGroupsSnapshots: () => void = () => {}

  componentDidMount() {
    this.cancelBookingsSnapshots = this.createBookingsSubcription()
    this.cancelGroupsSnapshots = this.createGroupsSubscription()
  }

  componentDidUpdate(prevProps: DashboardProps, prevState: DashboardState) {
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
  }

  render() {
    console.log('Dashboard render', this.state)
    const bookingsGroupedByPickUp = groupBookinsByPickUp(this.state.bookings)
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
              this.setState(() => ({ chosenDate: new Date(newValue) }))
            }}
          />
        </label>
        <Groups date={this.state.chosenDate} groups={this.state.groups} />
        <h3>Bookings grouped by pickup</h3>
        {Object.keys(bookingsGroupedByPickUp).map(pickup => (
          <div key={pickup} className="pickUpContainer">
            <div className="pickupHeader">
              <h4>{pickup}</h4>
              <span>{totalPax(bookingsGroupedByPickUp[pickup])} PAX</span>
              <select
                value={bookingsGroupedByPickUp[pickup][0].groupId || ''}
                onChange={event => {
                  const newGroupId = event.target.value || undefined
                  const batch = firestore.batch()
                  const pickupTotalPax = totalPax(
                    bookingsGroupedByPickUp[pickup],
                  )
                  const oldGroupId = bookingsGroupedByPickUp[pickup][0].groupId
                  bookingsGroupedByPickUp[pickup].forEach(b => {
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
                  const oldGroup = this.state.groups.find(
                    i => i.id === oldGroupId,
                  )
                  if (oldGroup) {
                    const oldGroupUpdate: Partial<Group> = {
                      pax: oldGroup.pax - pickupTotalPax,
                    }
                    console.log({ oldGroupUpdate })
                    batch.update(
                      firestore.collection('groups').doc(oldGroupId),
                      oldGroupUpdate,
                    )
                  }
                  const newGroup = this.state.groups.find(
                    i => i.id === newGroupId,
                  )
                  if (newGroup) {
                    const newGroupUpdate: Partial<Group> = {
                      pax: newGroup.pax + pickupTotalPax,
                    }
                    console.log({ newGroupUpdate })
                    batch.update(
                      firestore.collection('groups').doc(newGroupId),
                      newGroupUpdate,
                    )
                  }
                  console.log({ newGroupId, pickupTotalPax, oldGroupId })
                  batch.commit().then(() => console.log('pickup loc updated'))
                }}
              >
                <option value=""> - Choose pickup group - </option>
                {this.state.groups.map(g => (
                  <option key={g.id} value={g.id}>
                    #{g.friendlyKey} - {g.driverName ? g.driverName : '    '} -{' '}
                    {g.busName ? g.busName : '    '}
                  </option>
                ))}
              </select>
            </div>
            <table>
              <tbody>
                {bookingsGroupedByPickUp[pickup].map(b => (
                  <tr key={b.bookingRef}>
                    <td>{b.mainContact}</td>
                    <td>{b.pax}</td>
                    <td>{b.seller}</td>
                    <td>{b.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </main>
    )
  }

  createGroupsSubscription = () =>
    firestore
      .collection('groups')
      .where('date', '==', this.state.chosenDate)
      .orderBy('friendlyKey', 'desc')
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
      .collection('bookings')
      .where('date', '==', this.state.chosenDate)
      .onSnapshot(s => {
        const bookings = s.docs.map<Booking>(b => ({
          ...(b.data() as Booking),
          date: b.data().date.toDate(),
        }))
        this.setState(() => ({ bookings }))
      })
}
