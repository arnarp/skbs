import * as React from 'react'
import { subscribeOnDrivers } from '../../firebase/firestore/drivers';
import { Driver } from '../types/Driver';

export function useDrivers() {
  const [drivers, setDrivers] = React.useState<Driver[]>([])
  React.useEffect(() => {
    return subscribeOnDrivers({}, setDrivers)
  }, [])
  return drivers
}