import { createContext } from "react";
import { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  userDoc: any | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userDoc: null,
  loading: true,
});
