// EditSer.js
import React from 'react';
import Sidebar from '../../components/Sidebar';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';

const EditSer = () => {
  

  return (
    <div className="app-container" style={{  display: 'flex' , flexDirection: 'row' }}>
      <Sidebar /> 
      <div className="content" style={{marginTop:'20px', marginLeft:'40px'}}>
         
         <div className='text-box' style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'rgb(216, 230, 252)', textAlign: 'center', width:'40px'}}>
          1.3
         </div>
         <br></br>
         <div>
          The Faculty / Institute adopts management procedures that are in compliance with national and institutional Standard Operational Procedures ( SOPs ) , and they are documented and widely circulated .
         </div>
         <br></br>
         <div className='text-box' style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'rgb(216, 230, 252)', textAlign: 'center', width:'200px'}}>
          University adhere to Standards
         </div>
         <br></br>
         <div className="box" style={{border: '1px solid #000' , padding: '10px' , backgroundColor: '#f0f0f0' , display: 'flex'}}>
           <input type="text" className="input-field" style={{border: 'none', outline: 'none' , padding: '5px', width: '80px' , height: '100px' , background: 'transparent'}}/>
         </div>
         <br></br>
         <div style={{display: 'flex' , flexDirection: 'row'}}>
         <div className='text-box' style={{  border: '1px solid #000', padding: '5px', backgroundColor: 'rgb(216, 230, 252)', textAlign: 'center', width:'200px'}}>
          Documentary Evidences 
         </div>
        <Button variant="contained" style={{ marginLeft: '10px' , backgroundColor:'blue' }}>
          Add Evidences
        </Button>
         </div>
         <br></br>
         <div className="box" style={{border: '1px solid #000' , padding: '10px' , backgroundColor: '#f0f0f0' , display: 'flex'}}>
           <input type="text" className="input-field" style={{border: 'none', outline: 'none' , padding: '5px', width: '80px' , height: '50px' , background: 'transparent'}}/>
         </div>
         <br></br>
         <div style={{alignItems: 'center', marginLeft:'300px'}}>
         <Button variant="contained" style={{ marginRight: '10px' , backgroundColor:'#aad250' }}>
          Save
        </Button>
        <Button variant="contained" style={{ marginRight: '10px' , backgroundColor:'#c94646' }}>
          Cancel
        </Button>
        </div>
        <br></br>
        <div style={{alignItems: 'center', marginLeft:'295px'}}>
         <Button variant="contained" style={{ marginRight: '10px' , backgroundColor:'#a2cbea' }}>
          Go to the Application
        </Button>
        
        </div>
          
         </div>
    </div>
  );
};

export default EditSer;
