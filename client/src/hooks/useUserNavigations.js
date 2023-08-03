import { useContext } from "react";
import UserNavigationsContext from "../contexts/UserNavigationsProvider";

const useUserNavigations = () => {
    const { userNavigations } = useContext(UserNavigationsContext);
    return { userNavigations };
}

export default useUserNavigations;