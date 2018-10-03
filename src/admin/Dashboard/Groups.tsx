import * as React from 'react'
import './Groups.css'
import { Button } from '../../shared/components/Button'
import { Modal } from '../../shared/components/Modal'
import { DriverDocument, Driver } from '../../shared/types/Driver'
import { firestore } from '../firebase'
import { BusDocument, Bus } from '../../shared/types/Bus'
import { GroupDocument, Group } from '../../shared/types/Group'

type GroupsProps = {
  date: Date
  groups: Group[]
}

type GroupsState = Readonly<{
  // driver modal
  showAddDriverModal: boolean
  newDriverName: string
  // bus modal
  showAddBusModal: boolean
  newBusName: string
  newBusMaxPax: number
  // group modal
  drivers: Driver[]
  buses: Bus[]
}>
const initialState: GroupsState = {
  // driver modal
  showAddDriverModal: false,
  newDriverName: '',
  // bus modal
  showAddBusModal: false,
  newBusName: '',
  newBusMaxPax: 0,
  // group modal
  drivers: [],
  buses: [],
}

export class Groups extends React.PureComponent<GroupsProps, GroupsState> {
  readonly state: GroupsState = initialState
  addDriverBtn: HTMLButtonElement
  addBusBtn: HTMLButtonElement
  addGroupBtn: HTMLButtonElement
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
        <h3>Groups</h3>
        <table>
          <tbody>
            {this.props.groups.map(g => (
              <tr key={g.id}>
                <td>{g.friendlyKey}</td>
                <td>
                  <select
                    value={g.driverId || ''}
                    onChange={event => {
                      const newGroupDriverId = event.target.value
                      console.log('onChange', { newGroupDriverId })
                      const newGroupDriver = this.state.drivers.find(
                        value => value.id === newGroupDriverId,
                      )
                      const groupUpdate: Partial<GroupDocument> = {
                        driverId: newGroupDriver
                          ? newGroupDriver.id
                          : undefined,
                        driverName: newGroupDriver
                          ? newGroupDriver.name
                          : undefined,
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
                </td>
                <td>
                  <select
                    value={g.busId || ''}
                    onChange={event => {
                      const newGroupBusId = event.target.value
                      const newGroupBus = this.state.buses.find(
                        value => value.id === newGroupBusId,
                      )
                      const groupUpdate: Partial<GroupDocument> = {
                        busId: newGroupBus ? newGroupBus.id : undefined,
                        busName: newGroupBus ? newGroupBus.name : undefined,
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
                </td>
                <td>
                  {g.pax}/{g.maxPax || '?'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="buttonsRow">
          <Button
            color="default"
            style="flat"
            inputRef={el => (this.addDriverBtn = el)}
            onClick={() => this.setState(() => ({ showAddDriverModal: true }))}
          >
            Add driver
          </Button>
          <Button
            color="default"
            style="flat"
            inputRef={el => (this.addBusBtn = el)}
            onClick={() => this.setState(() => ({ showAddBusModal: true }))}
          >
            Add bus
          </Button>
          <Button
            color="default"
            style="flat"
            inputRef={el => (this.addGroupBtn = el)}
            onClick={this.addGroup}
          >
            Add group
          </Button>
        </div>
        <Modal
          show={this.state.showAddDriverModal}
          onClose={() =>
            this.setState(() => ({
              showAddDriverModal: false,
              newDriverName: '',
            }))
          }
          focusAfterClose={() => this.addDriverBtn.focus()}
          header="Add new driver"
        >
          <form onSubmit={this.submitAddDriverForm} className="groupsForm">
            <label>
              Name
              <input
                type="text"
                value={this.state.newDriverName}
                onChange={event => {
                  const newDriverName = event.target.value
                  this.setState(() => ({ newDriverName }))
                }}
              />
            </label>
            <div>
              <Button type="submit" color="primary" style="flat">
                Add driver
              </Button>
            </div>
          </form>
        </Modal>
        <Modal
          show={this.state.showAddBusModal}
          onClose={() =>
            this.setState(() => ({
              showAddBusModal: false,
              newBusMaxPax: 0,
              newBusName: '',
            }))
          }
          focusAfterClose={() => this.addBusBtn.focus()}
          header="Add new bus"
        >
          <form onSubmit={this.submitAddBusForm} className="groupsForm">
            <label>
              Name
              <input
                type="text"
                value={this.state.newBusName}
                onChange={event => {
                  const newBusName = event.target.value
                  this.setState(() => ({ newBusName }))
                }}
              />
            </label>
            <label>
              Max PAX
              <input
                type="number"
                value={this.state.newBusMaxPax}
                onChange={event => {
                  const newBusMaxPax = Number(event.target.value)
                  this.setState(() => ({ newBusMaxPax }))
                }}
              />
            </label>
            <div>
              <Button type="submit" color="primary" style="flat">
                Add bus
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    )
  }
  private submitAddDriverForm = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    const newDriverDoc: DriverDocument = {
      name: this.state.newDriverName,
    }
    firestore
      .collection('drivers')
      .add(newDriverDoc)
      .then(() => {
        this.setState(() => ({ showAddDriverModal: false, newDriverName: '' }))
      })
  }
  private submitAddBusForm = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    const newBusDoc: BusDocument = {
      name: this.state.newBusName,
      maxPax: this.state.newBusMaxPax,
    }
    firestore
      .collection('buses')
      .add(newBusDoc)
      .then(() => {
        this.setState(() => ({
          showAddBusModal: false,
          newBusMaxPax: 0,
          newBusName: '',
        }))
      })
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
