// this component is used for protected routes
import { Outlet, useLocation, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import PropTypes from "prop-types";

const Authenticate = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation(); // to redirect the user to where he/she came from

  return auth?.roles &&
    JSON.parse(auth?.roles).some((role) => allowedRoles.includes(role)) ? (
    <Outlet />
  ) : auth?.user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="login" state={{ from: location }} replace />
  );
};

Authenticate.propTypes = {
  allowedRoles: PropTypes.array,
};

export default Authenticate;
