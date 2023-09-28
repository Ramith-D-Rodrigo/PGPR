// Sidebar.js
import React from 'react';
import { Button } from '@mui/material';

const SidebarItem = ({ label, setSelectedStandard, standardId }) => {
  const setSelection = (e) => {
    setSelectedStandard({
      id:standardId,
      standardNo: label
    });
  }

  return (
    <div className="sidebar-item" style={{ marginTop: '10px', width: 'drawerWidth', flexShrink: '0',
    '& .MuiDrawerPaper': {
      width: 'drawerWidth',
      boxSizing: 'border-box',
    },
    boxShadow: !open? "none" : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    }}>
      <Button onClick={setSelection} id={label}>
        {label}
      </Button>
    </div>
  );
};

const Sidebar = ({sideBarItems, setSelectedStandard}) => {
  
  return (
    <div className="sidebar" style={{ marginTop: '20px', width: '150px' , backgroundColor: 'rgb(216, 230, 252)' , color: 'black', height:'500px' , padding: '20px'}}>
        <div>
            Standards
        </div>
      {sideBarItems.map(row => (
        <SidebarItem key={row.id} label={row.standardNo} setSelectedStandard={setSelectedStandard} standardId={row.id}/>
      ))}
    </div>
  );
};

export default Sidebar;
