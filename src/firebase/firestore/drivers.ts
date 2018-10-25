import { firestore } from ".."
import { Driver } from "../../shared/types/Driver";

export function subscribeOnDrivers(onDrivers: (drivers: Driver[]) => void) {
  return firestore
    .collection("drivers")
    .orderBy("name", "desc")
    .onSnapshot(s => {
      const drivers = s.docs.map<Driver>(d => ({
        id: d.id,
        name: d.data().name,
      }))
      console.log("fetched drivers", drivers)
      onDrivers(drivers)
    })
}
