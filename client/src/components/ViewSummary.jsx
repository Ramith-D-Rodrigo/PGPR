import React from 'react';
import Button from '@mui/material/Button';

const ViewSummary = ({ isOpen, onClose }) => {
  // Create a function to handle closing the pop-up
  const handleClose = () => {
    onClose();
  };

  // Render the pop-up content if isOpen is true
  return (
    isOpen && (
      <div className="popup-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="popup-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}>
          <div className='header' style={{ textAlign: 'center', fontWeight: 'bold' }}>
            <h2>Summary of Programme Management</h2>
          </div>
          <br></br>
          <div className='body'>
            <div>
              <label>Completed Standards:</label>
              <input type="text" style={{ border: '1px solid black', padding: '5px', marginLeft: '30px' }} />
            </div>
            <div>
              <label>Evidences:</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px' }}>
              <label>Y1</label>
              <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} />
              <label>Y2</label>
              <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} />
              <label>Y3</label>
              <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} />
              <label>Y4</label>
              <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} />
              <label>Y5</label>
              <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} />
            </div>
          </div>
          <br></br>
          <button onClick={handleClose} variant="contained" color="error" style={{ marginRight: '10px' }}>Close</button>
        </div>
      </div>
    )
  );
};

export default ViewSummary;
