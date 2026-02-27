import { Timestamp } from "firebase/firestore";

export interface Users {
    uid?: string;
    role?: string;
    email?: number;
    createdAt?: Timestamp;

}