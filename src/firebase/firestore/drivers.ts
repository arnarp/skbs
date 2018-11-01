import { firestore } from ".."
import { Driver, DriverDocument } from "../../shared/types/Driver"
import { OrderByDirection } from "@google-cloud/firestore"

export function subscribeOnDrivers(
  config: {
    orderBy?: {
      fieldPath: keyof Driver
      directionStr: OrderByDirection
    }
  },
  onDrivers: (drivers: Driver[]) => void,
) {
  const orderBy = config.orderBy || { fieldPath: "name", directionStr: "desc" }
  const collection = firestore.collection("drivers")
  let query = collection.orderBy(orderBy.fieldPath, orderBy.directionStr)
  return query.onSnapshot(s => {
    const drivers = s.docs.map<Driver>(d => ({
      id: d.id,
      ...(d.data() as DriverDocument),
    }))
    console.log("fetched drivers", drivers)
    onDrivers(drivers)
  })
}
