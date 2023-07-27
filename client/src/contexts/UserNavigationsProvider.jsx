import { createContext, useState } from "react";

// User Navigations context
const UserNavigationsContext = createContext({});

export const UserNavigationsProvider = ({children}) => {

    const [userNavigations, setUserNavigations] = useState([]);
  return (
    <UserNavigationsContext.Provider value={{userNavigations, setUserNavigations}}>
        {children}
    </UserNavigationsContext.Provider>
  )
}

export default UserNavigationsContext;