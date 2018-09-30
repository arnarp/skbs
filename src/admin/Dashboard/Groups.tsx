import * as React from 'react'
import './Groups.css'
import { Button } from '../../shared/components/Button'
import { Modal } from '../../shared/components/Modal'
import { DriverDocument, Driver } from '../../shared/types/Driver'
import { firestore } from '../firebase'
import { BusDocument, Bus } from '../../shared/types/Bus'
import { GroupDocument } from '../../shared/types/Group'

type GroupsProps = {
  date: Date
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
  showAddGroupModal: boolean
  newGroupDriver?: Driver
  newGroupBus?: Bus
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
  showAddGroupModal: false,
  newGroupDriver: undefined,
  newGroupBus: undefined,
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
        this.setState(() => ({
          buses,
        }))
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
            onClick={() => this.setState(() => ({ showAddGroupModal: true }))}
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
            <Button type="submit" color="primary" style="flat">
              Add driver
            </Button>
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
            <Button type="submit" color="primary" style="flat">
              Add bus
            </Button>
          </form>
        </Modal>
        <Modal
          show={this.state.showAddGroupModal}
          onClose={() =>
            this.setState(() => ({
              showAddGroupModal: false,
              newGroupDriver: undefined,
              newGroupBus: undefined,
            }))
          }
          focusAfterClose={() => this.addGroupBtn.focus()}
          header="Add new group"
        >
          <form onSubmit={this.submitAddGroupForm} className="groupsForm">
            <label>
              Driver
              <select
                value={
                  this.state.newGroupDriver ? this.state.newGroupDriver.id : ''
                }
                onChange={event => {
                  const newGroupDriverId = event.target.value
                  console.log('onChange', { newGroupDriverId })
                  this.setState(() => ({
                    newGroupDriver: this.state.drivers.find(
                      value => value.id === newGroupDriverId,
                    ),
                  }))
                }}
              >
                <option value="">Choose later</option>
                {this.state.drivers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Bus
              <select
                value={this.state.newGroupBus ? this.state.newGroupBus.id : ''}
                onChange={event => {
                  const newGroupBusId = event.target.value
                  this.setState(() => ({
                    newGroupBus: this.state.buses.find(
                      value => value.id === newGroupBusId,
                    ),
                  }))
                }}
              >
                <option value="">Choose later</option>
                {this.state.buses.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>

            <Button type="submit" color="primary" style="flat">
              Add group
            </Button>
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
  private submitAddGroupForm = (event: React.FormEvent<{}>) => {
    event.preventDefault()
    const newGroupDoc: GroupDocument = {
      date: this.props.date,
      pax: 0,
    }
    if (this.state.newGroupBus) {
      newGroupDoc.busId = this.state.newGroupBus.id
      newGroupDoc.busName = this.state.newGroupBus.name
      newGroupDoc.maxPax = this.state.newGroupBus.maxPax
    }
    if (this.state.newGroupDriver) {
      newGroupDoc.driverId = this.state.newGroupDriver.id
      newGroupDoc.driverName = this.state.newGroupDriver.name
    }
    console.log('newGroup', newGroupDoc)
    // firestore
    //   .collection('groups')
    //   .add(newGroupDoc)
    //   .then(() => {
    //     this.setState(() => ({
    //       showAddGroupModal: false,
    //       newGroupDriver: undefined,
    //       newGroupBus: undefined,
    //     }))
    //   })
  }
}
