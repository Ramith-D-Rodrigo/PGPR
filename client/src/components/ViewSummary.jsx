import React, { useState } from 'react';
import Button from '@mui/material/Button';

const ViewSummary = ({ isOpen, onClose, selectedRow }) => {
  // Create state variables for the input fields
  const [completedStandards, setCompletedStandards] = useState('X1/27');
  const [yearlyEvidences, setYearlyEvidences] = useState({
    Y1: 11,
    Y2: 12,
    Y3: 13,
    Y4: 14,
    Y5: 15,
  });

  // Create a function to handle closing the pop-up
  const handleClose = () => {
    onClose();
  };

  // Render the pop-up content if isOpen is true
  return (
    isOpen && (
      <div className="popup" style={{  position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="popup-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}>
          <div className='header' style={{ textAlign: 'center', fontWeight: 'bold' }}>
            <h2>Summary of Programme Management</h2>
          </div>
          <br></br>
          <div className='body'>
            <div>
              <label>Completed Standards:</label>
              <input type="text" style={{ border: '1px solid black', padding: '5px', marginLeft: '30px' }} value={completedStandards} readOnly />
            </div>
            <div>
              <label>Evidences:</label>
            </div>
            <div>
              {Object.entries(yearlyEvidences).map(([year, evidence]) => (
                <div key={year}>
                  <label>{year}</label>
                  <input
                    type="text"
                    style={{ width: '50px', border: '1px solid black', padding: '5px' }}
                    value={evidence}
                    readOnly/>
                </div>
              ))}
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
