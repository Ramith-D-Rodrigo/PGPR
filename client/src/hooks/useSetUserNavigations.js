import { useEffect, useContext } from "react";
import UserNavigationsContext from "../contexts/UserNavigationsProvider";

const useSetUserNavigations = (navigations) =>
{
    const {setUserNavigations} = useContext(UserNavigationsContext);
    useEffect(()=>{
        setUserNavigations(navigations);
    },[]);
}

export default useSetUserNavigations;