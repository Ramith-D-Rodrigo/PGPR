import {useState, createContext} from 'react';

const DrawerStateContext = createContext();
export const DrawerStateProvider = ({children}) => {
    const [drawerState, setDrawerState] = useState({
        open: true,
    });
    return (
        <DrawerStateContext.Provider value={{drawerState, setDrawerState}}>
            {children}
        </DrawerStateContext.Provider>
    )
}

export default DrawerStateContext;