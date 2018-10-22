import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import './GroupPage.css'
import { Group, GroupDocument } from '../../shared/types/Group'
import { firestore } from '../firebase'
import { Collections } from '../../shared/constants'
import {
  Booking,
  toursInBookings,
  groupBookinsByPickUp,
  totalPax,
} from '../../shared/types/Booking'
import { propertyOf } from '../../shared/types/utils'
import Helmet from 'react-helmet'

type GroupPageProps = {}
type GroupPageState = Readonly<{
  group?: Group | null
  bookings?: Booking[]
}>

const initialState: GroupPageState = {}

export class GroupPage extends React.PureComponent<
  GroupPageProps & RouteComponentProps<{ id: string }>,
  GroupPageState
> {
  readonly state: GroupPageState = initialState
  cancelGroupSubscription: () => void = () => {}
  cancelBookingsSubscription: () => void = () => {}

  componentDidMount() {
    console.log('Group did mount', this.props.match.params.id)
    this.cancelGroupSubscription = this.createGroupSubscription(this.props.match.params.id)
    this.cancelBookingsSubscription = this.createBookingsSubscription(this.props.match.params.id)
  }

  componentWillUnmount() {
    this.cancelGroupSubscription()
    this.cancelBookingsSubscription()
  }

  render() {
    if (this.state.group === undefined) {
      return null
    }
    if (this.state.group === null) {
      return (
        <main className="Group">
          <h1>Not found</h1>
        </main>
      )
    }
    return (
      <main className="GroupPage">
        <Helmet>
          <title>Pickup sheet</title>
        </Helmet>
        <div className="header">
          <h1>
            {this.state.group.date.toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            ,<br />
            {toursInBookings(this.state.bookings || [])}
          </h1>
          <dl>
            {this.state.group.driver && (
              <React.Fragment>
                <dt>Driver</dt>
                <dd>{this.state.group.driver.name}</dd>
              </React.Fragment>
            )}
            {this.state.group.bus && (
              <React.Fragment>
                <dt>Bus</dt>
                <dd>{this.state.group.bus.name}</dd>
              </React.Fragment>
            )}
            {this.state.bookings && (
              <React.Fragment>
                <dt>Pax</dt>
                <dd>{totalPax(this.state.bookings)}</dd>
              </React.Fragment>
            )}
          </dl>
        </div>
        {this.state.bookings &&
          groupBookinsByPickUp(this.state.bookings).map(p => (
            <div key={p.pickUpName} className="Pickup">
              <h2>{p.pickUpName}</h2>
              <table>
                <tbody>
                  {p.bookings.map(b => (
                    <tr key={b.import.bookingRef}>
                      <td>{b.pax}</td>
                      <td>{b.import.mainContact}</td>
                      <td>{b.import.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        {this.state.group && this.state.group.note && <p>{this.state.group.note}</p>}
      </main>
    )
  }

  private createGroupSubscription = (id: string) => {
    return firestore
      .collection(Collections.Groups)
      .doc(id)
      .onSnapshot(doc => {
        const data = doc.data()
        if (doc.exists && data) {
          const group: Group = {
            ...(data as GroupDocument),
            date: data.date.toDate(),
            id: doc.id,
          }
          this.setState(() => ({ group }))
        } else {
          this.setState(() => ({ group: null }))
        }
      })
  }
  private createBookingsSubscription = (id: string) => {
    return firestore
      .collection(Collections.Bookings)
      .where(propertyOf<Booking>('groupId'), '==', id)
      .onSnapshot(s => {
        const bookings = s.docs.map<Booking>(b => ({
          ...(b.data() as Booking),
        }))
        this.setState(() => ({ bookings }))
      })
  }
}
