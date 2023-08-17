import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react'; // Import useState hook
import Button from '@mui/material/Button';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';

const SubmitPGPR = () => {
  useSetUserNavigations([
    {
      name: 'Self Evaluation Report',
      link: '/Self Evaluation Report',
    },
  ]);

 
  const rawData = {
    university: "University of Colombo",
    faculty: "University of Colombo School of Computing",
    pgprId: "PGPR-123",
    pgprName: "MSc",
    startDate: "2023-08-09",
    slqfLevel: "5",
    coordinator: "Dr.Samantha",
  };

  return (
    <>
      <div>
       
        <div>
          <label htmlFor="university" className="block font-medium center text-gray-2000">
            University Name: {rawData.university}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            Faculty/Institute: {rawData.faculty}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            PGPR ID: {rawData.pgprId}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            PGPR Name: {rawData.pgprName}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            Application Start Date: {rawData.startDate}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            SLQF Level: {rawData.slqfLevel}
          </label>
        </div>
        <div>
          <label htmlFor="faculty/institute" className="block font-medium text-gray-2000">
            Programme Coordinator: {rawData.coordinator}
          </label>
        </div>
      </div>
      <br></br>
      <div style={{ textAlign: 'center', fontWeight: 'bold', textDecoration: 'underline' }}>
        <header style={{fontSize:'15px'}}>
          Upload the final SER Report for Evaluation
        </header>
      </div>
      <br>
      </br>
      <div style={{ marginLeft:'200px', display: 'flex', flexDirection: 'row'  }}>
      <div>
        <label style={{align:'center'}}>Part A:</label>
        <input type="text" style={{ border: '1px solid black', padding: '5px' , marginRight:'20px'}} />
      </div>
      <div>
        <label>Part B:</label>
        <input type="text" style={{ border: '1px solid black', padding: '5px' , marginRight:'20px'}} />
      </div>
      <div>
        <label>Part D:</label>
        <input type="text" style={{ border: '1px solid black', padding: '5px' , marginRight:'20px'}}/>
      </div>
    </div>
    <br>
    </br>
    <div style={{marginLeft:'345px'}}>
        <label>Upload Final SER:</label>
        <input type="text" style={{ border: '1px solid black', padding: '5px' , marginRight:'20px'}} />
      </div>
      <br>
    </br>
    <div style={{marginLeft:'340px'}}>
        <label>Payment Evidence:</label>
        <input type="text" style={{ border: '1px solid black', padding: '5px' , marginRight:'20px'}} />
      </div>
      <br>
    </br>
    <div style={{ marginLeft: '340px' }}>
      <div style={{ display: 'flex',alignItems: 'center',margin: '20px',}}>
        <input type="checkbox" style={{ width: '15px',height: '15px',marginRight: '10px',border: '1px solid black',}} />
        <label>Have updated online forms for standards and evidence links</label>
      </div>
    </div> 

      <div style={{ marginTop: '10px', textAlign: 'right' }}>
        <Button variant="contained" color="error" style={{ marginRight: '10px' }}>
          Submit SER
        </Button>
        <Button variant="contained" color="error">
          Cancel
        </Button>
      </div>
    </>
  );
};

export default SubmitPGPR;
