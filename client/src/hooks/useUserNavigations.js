import { useContext } from "react";
import UserNavigationsContext from "../contexts/UserNavigationsProvider";

const useUserNavigations = () => {
    const { userNavigations, setUserNavigations } = useContext(UserNavigationsContext);
    return { userNavigations, setUserNavigations };
}

export default useUserNavigations;