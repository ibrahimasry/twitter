import React, {useContext} from "react";
import {FaTwitter} from "react-icons/fa";
import {useQuery} from "react-query";
import {getUser} from "./util/api";
const AuthContext = React.createContext();
export default function AuthProvider({children}) {
  const {data, isLoading, refetch} = useQuery("getUser", getUser);
  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <FaTwitter className="animate-pulse animate-ping h-14 w-14"></FaTwitter>
      </div>
    );
  const user = data || null;
  if (user) user.refetch = refetch;
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const user = useContext(AuthContext);
  return user;
}
