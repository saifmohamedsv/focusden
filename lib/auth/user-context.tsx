"use client";
import { createContext, useContext } from "react";

interface UserInfo {
  name: string;
  email: string;
  image: string;
}

const UserContext = createContext<UserInfo | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserInfo | null;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
