import React, { useState } from 'react';


const Popup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <div>
      <button onClick={togglePopup}>Open Popup</button>

      {isPopupOpen && (
        <div className="popup-overlay" style={{position: 'fixed' , top: '0' , left: '0', width: '100%' , height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div className="popup-content" style={{backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)'}}>
            <h2>Popup Content</h2>
            <p>This is the content of the popup.</p>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
