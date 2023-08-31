import React from 'react';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddDean from './AddDean';
import AddProgrammeCoordinator from './AddProgrammeCoordinator';
import AddIQAUDiretor from './AddIQAUDiretor';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const AddAccounts = () => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useSetUserNavigations(
    [
        {
          name: "Manage Accounts",
          link: "/AddAccounts"
        },
      
    ]
);
  // Define your form submission logic here
  const handleSubmit = (formValues) => {
    // Handle form submission
    console.log(formValues);
  };

  // Define your form cancellation logic here
  const handleCancel = () => {
    // Handle form cancellation
    console.log('Form cancelled');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider',marginBottom: 2, }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Add a Dean/Director" {...a11yProps(0)} />
          <Tab label="Add a Programme Coordinator" {...a11yProps(1)} />
          <Tab label="Add a IQAU director" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <AddDean/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <AddProgrammeCoordinator/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <AddIQAUDiretor/>
      </CustomTabPanel>
  </Box>
 
  );
};

export default AddAccounts;
