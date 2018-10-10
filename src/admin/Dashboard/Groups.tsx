import * as React from 'react'
import './Groups.css'
import { Button } from '../../shared/components/Button'
import { Driver } from '../../shared/types/Driver'
import { firestore } from '../firebase'
import { BusDocument, Bus } from '../../shared/types/Bus'
import { GroupDocument, Group } from '../../shared/types/Group'
import { AddDriverModalButton } from './AddDriverModalButton'
import { AddBusModalButtonButton } from './AddBusModalButton'
import { AddTourModalButton } from './AddTourModalButton';
import { AddPickUpLocationModalButton } from './AddPickUpLocationModalButton';

type GroupsProps = {
  date: Date
  groups: Group[]
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
        <table>
          <tbody>
            {this.props.groups.map(g => (
              <tr key={g.id}>
                <td>{g.friendlyKey}</td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
                  {g.pax}/{g.maxPax || '?'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
