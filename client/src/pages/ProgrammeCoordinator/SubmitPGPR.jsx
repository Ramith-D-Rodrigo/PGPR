import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useState } from 'react'; // Import useState hook
import Button from '@mui/material/Button';
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import DiscriptionDiv from '../../components/DiscriptionDiv';
import useDrawerState from '../../hooks/useDrawerState';

const SubmitPGPR = () => {
  const {uniId} = useParams();
    const open = useDrawerState().drawerState.open;

    useSetUserNavigations(
        [
            {
              name: "PG Assignments",
              link: "/PG_Assignments"
            },
            {
                name: "Self Evaluation Report",
                link: "/PG_Assignments/SubmitPGPR/"+uniId
            }
        ]
    );

    let descriptionWidth = 30;

    const [expand, setexpand] = useState(8);

    let bodyHeight = open ==true? `${90-expand}%` : `calc( ${90-expand}% - 60px )`;
    const handleClick = ()=>{
        if(expand==8)
        {
        setexpand(descriptionWidth);
        }
        else{
        setexpand(8);
        }
    };
    let tableHeight = expand ==8? {} : {height:'300px'};


    const headerRowStyle = {
      display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '70%', padding: '0 20px', fontSize: '16px',borderBottom: '1px solid #00000020'
  };

  const headerRowDivStyle = {width:'50%',textAlign:'left'};

  const headerInfo = [
      { label: "University:", value: "University of Colombo" },
      {
        label: "Faculty/Institute:",
        value: "University of Colombo School of Computing",
      },
      { label: "PGPR ID:", value: uniId },
      { label: "PGPR Name:", value: "MSc" },
      { label: "Application Start Date:", value: "12/12/2020" },
      { label: "Submission Date:", value: "01/01/2021" },
      { label: "Program Coordinator:", value: "Mr. Smantha Karunanayake" },
    ];

  return (
    <>
      
      <DiscriptionDiv
                
                width="100%"
                height="auto"
                backgroundColor="#D8E6FC"
                sx={{marginBottom:'20px'}}
            >
                <Grid container spacing={2}>
                {headerInfo.map((infoItem, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                    <Typography align='left' variant="subtitle1">
                        <b>{infoItem.label}</b>
                    </Typography>
                    <Typography align='left'>{infoItem.value}</Typography>
                    </Grid>
                ))}
                </Grid>
            </DiscriptionDiv>

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
