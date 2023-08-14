import React, { useState } from 'react';
import useSetUserNavigations from '../hooks/useSetUserNavigations';
import Button from '@mui/material/Button';

const Popup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  useSetUserNavigations([
    {
      name: 'Self Evaluation Report',
      link: '/Self Evaluation Report',
    },
  ]);
  return (
    <div>
      <button onClick={togglePopup}>Open Popup</button>

      {isPopupOpen && (
        <div className="popup-overlay" style={{position: 'fixed' , top: '0' , left: '0', width: '100%' , height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div className="popup-content" style={{backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)'}}>
          <div className='header' style={{ textAlign: 'center', fontWeight: 'bold' }}>
             <h2>Add Evidence</h2>
            </div>
            <br></br>
            <div className='body'>
            <div>
                <label>Standard No:</label>
                <input type="text" style={{ border: '1px solid black', padding: '5px' , marginLeft:'30px'}} />
            </div>
            <br></br>
            <div>
                <label>Evidence Code:</label>
                <input type="text" style={{ border: '1px solid black', padding: '5px' , marginLeft:'20px'}} />
            </div>
            <br></br>
            <div>
                <label>Evidence Name:</label>
                <input type="text" style={{ border: '1px solid black', padding: '5px' , marginLeft:'15px'}} />
            </div>
            <br></br>
            <div>
                <label>Applicable Years:</label>
            </div>
            <div style={{ display: 'flex',alignItems: 'center',margin: '20px',}}>
                <label>Y1</label>
                 <input type="checkbox" style={{ width: '15px',height: '15px',marginRight: '10px',border: '1px solid black',}} />
                 <label>Y2</label>
                 <input type="checkbox" style={{ width: '15px',height: '15px',marginRight: '10px',border: '1px solid black',}} />
                 <label>Y3</label>
                 <input type="checkbox" style={{ width: '15px',height: '15px',marginRight: '10px',border: '1px solid black',}} />
                 <label>Y4</label>
                 <input type="checkbox" style={{ width: '15px',height: '15px',marginRight: '10px',border: '1px solid black',}} />
                 <label>Y5</label>
                 <input type="checkbox" style={{ width: '15px',height: '15px',marginRight: '10px',border: '1px solid black',}} />
             </div>
             <br></br>
             <div>
                <label>URL:</label>
                <input type="text" style={{ border: '1px solid black', padding: '5px' , marginLeft:'85px'}} />
            </div>
            </div>
            <br></br>
         <div style={{marginLeft:'80px'}} >   
        <Button variant="contained" color="error" style={{ marginRight: '10px' }}>
          Submit SER
        </Button>
            <button onClick={togglePopup} variant="contained" color="error" style={{ marginRight: '10px' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
