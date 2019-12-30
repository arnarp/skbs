import { firestore } from "firebase";
import { Omit } from "./utils";
import { EntityStatus } from "./types";

export type Driver = {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  status: EntityStatus;
};

export type DriverDocument = Omit<Driver, "id">;

export function parseDriverSnapshot(
  s: firestore.DocumentSnapshot | FirebaseFirestore.DocumentSnapshot
): Driver {
  return {
    ...(s.data() as DriverDocument),
    id: s.id
  };
}
