import * as React from "react"
import { RouteComponentProps } from "react-router-dom"
import "./GroupPage.css"
import { Group, GroupDocument } from "../../shared/types/Group"
import { firestore } from "../../firebase"
import { Collections } from "../../shared/constants"
import {
  Booking,
  toursInBookings,
  groupBookinsByPickUp,
  totalPax,
} from "../../shared/types/Booking"
import { propertyOf } from "../../shared/types/utils"
import Helmet from "react-helmet"

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
    console.log("Group did mount", this.props.match.params.id)
    this.cancelGroupSubscription = this.createGroupSubscription(this.props.match.params.id)
    this.cancelBookingsSubscription = this.createBookingsSubscription(this.props.match.params.id)
  }

  componentWillUnmount() {
    this.cancelGroupSubscription()
    this.cancelBookingsSubscription()
  }

  render() {
    console.log("GroupPage render", this.state)
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
            {this.state.group.date.toLocaleDateString("en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            , <span>{toursInBookings(this.state.bookings || [])}</span>
          </h1>
          <div className="subheader">
            {this.state.group.driver && (
              <span>
                <b>Driver: </b>
                {this.state.group.driver.name}
              </span>
            )}
            {this.state.group.bus && (
              <span>
                <b>Vehicle: </b>
                {this.state.group.bus.name}
              </span>
            )}
            {this.state.bookings && (
              <span>
                <b>Pax: </b>
                {totalPax(this.state.bookings)}
              </span>
            )}
          </div>
        </div>
        {this.state.bookings &&
          groupBookinsByPickUp(this.state.bookings).map(p => (
            <div key={p.pickUpName} className="Pickup">
              <h2>{p.pickUpName}</h2>
              <table>
                <tbody>
                  {p.bookings.map(b => (
                    <tr key={b.import.bookingRef}>
                      <td>{b.pax} PAX</td>
                      <td>{b.mainContact}</td>
                      <td>{b.paymentStatus}</td>
                      <td>{b.import.seller}</td>
                      <td>{b.operationsNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        <div className="note-container">
          <textarea
            aria-label="Note"
            rows={3}
            value={this.state.group.note || ""}
            onChange={event => {
              const update: Partial<Group> = {
                note: event.target.value,
              }
              const group = this.state.group
              if (group) {
                firestore
                  .collection(Collections.Groups)
                  .doc(group.id)
                  .update(update)
              }
            }}
          />
          <div className="note">
            {this.state.group &&
              this.state.group.note &&
              this.state.group.note.split(/\r?\n/).map((val, index) => <p key={index}>{val}</p>)}
          </div>
        </div>
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
      .where(propertyOf<Booking>("groupId"), "==", id)
      .onSnapshot(s => {
        const bookings = s.docs.map<Booking>(b => ({
          ...(b.data() as Booking),
        }))
        this.setState(() => ({ bookings }))
      })
  }
}
