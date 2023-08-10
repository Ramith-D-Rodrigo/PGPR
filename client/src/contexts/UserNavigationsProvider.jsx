import { createContext, useState } from "react";
import { PropTypes } from "prop-types";

// User Navigations context
const UserNavigationsContext = createContext({});

export const UserNavigationsProvider = ({ children }) => {
  UserNavigationsProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

  const [userNavigations, setUserNavigations] = useState([]);

  return (
    <UserNavigationsContext.Provider
      value={{ userNavigations, setUserNavigations }}
    >
      {children}
    </UserNavigationsContext.Provider>
  );
};

export default UserNavigationsContext;
