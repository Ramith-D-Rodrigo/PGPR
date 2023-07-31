import { useContext } from "react";
import DrawerStateContext from '../contexts/DrawerStateProvider'

const useDrawerState = ()=>{
    return useContext(DrawerStateContext)
}

export default useDrawerState;