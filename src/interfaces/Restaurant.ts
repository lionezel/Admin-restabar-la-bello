import { Timestamp } from "firebase/firestore";

export type Restaurant = {
  id: string;
  name: string;
  description?: string
  image?: string;
  createdAt: Timestamp;
};