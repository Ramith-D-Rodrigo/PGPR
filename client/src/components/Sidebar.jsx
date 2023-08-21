// Sidebar.js
import React from 'react';

const SidebarItem = ({ label }) => (
  <div className="sidebar-item" style={{ marginTop: '10px', width: 'drawerWidth', flexShrink: '0',
  '& .MuiDrawer-paper': {
    width: 'drawerWidth',
    boxSizing: 'border-box',
  },
  boxShadow: !open? "none" : "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
}}>{label}</div>
);

const Sidebar = () => {
  const sidebarItems = [ 'Standard 1.0', 'Standard 1.1', 'Standard 1.2', 'Standard 1.3', 'Standard 1.4', 'Standard 1.5', 'Standard 1.6', 'Standard 1.7', 'Standard 1.8', 'Standard 1.9', 'Standard 1.10', 'Standard 1.11', 'Standard 1.12', 'Standard 1.13', 'Standard 1.14', 'Standard 1.15'];

  return (
    <div className="sidebar" style={{ marginTop: '20px', width: '150px' , backgroundColor: 'rgb(216, 230, 252)' , color: 'black', height:'500px' , padding: '20px'}}>
        <div>
            Standards
        </div>
      {sidebarItems.map((item, index) => (
        <SidebarItem key={index} label={item} />
      ))}
    </div>
  );
};

export default Sidebar;
