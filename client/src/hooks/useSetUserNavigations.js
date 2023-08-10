import { useEffect, useContext, useRef } from "react";
import UserNavigationsContext from "../contexts/UserNavigationsProvider";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useSetUserNavigations = (navigations) => {
  const { setUserNavigations } = useContext(UserNavigationsContext);
  const { auth } = useAuth();
  const Role = auth?.authRole[0];
  const navigate = useNavigate();
  const navigationsRef = useRef(navigations);

  useEffect(() => {
    !Role && navigate("/login");

    navigationsRef.current = navigationsRef.current.map((navigation) => {
      return {
        name: navigation.name,
        link:
          (String(navigation.link).includes("/" + Role) ? "" : "/" + Role) +
          navigation.link,
      };
    });
    setUserNavigations(navigationsRef.current);
  }, [Role, navigate, navigations, setUserNavigations]);
};

export default useSetUserNavigations;
