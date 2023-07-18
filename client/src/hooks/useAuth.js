import { useContext } from "react";
import AuthContext from "../contexts/AuthProvider";

const useAuth = () => {
  return useContext(AuthContext); // this returns the { auth, setAuth }
};

export default useAuth;
