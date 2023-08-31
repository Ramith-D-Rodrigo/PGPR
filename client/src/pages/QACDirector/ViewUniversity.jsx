import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import getAUniversity from '../../api/University/getAUniversity';
import { CircularProgress, Typography } from '@mui/material';
import { SERVER_URL } from '../../assets/constants';

const ViewUniversity = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);

    const [university, setUniversity] = useState(null);

    useEffect(() => {

        document.title = 'View University | QAC'

        const handleGetUniversity = async () => {

            setLoading(true);

            try{

                const queryParams = {
                  'includeCQA' : true,
                  'includeViceChancellor' : true,
                  'includeUniversitySide' : true,
                  'includeUser' : true,
                }

                console.log(id);
                const result = await getAUniversity(id, queryParams);

                console.log(result.data.data);
                setUniversity(result.data.data);
            }
            catch(err){
                console.log(err.response.data);
            }

            setLoading(false);
        }

        handleGetUniversity();
    }, [id]);

  return (
      <>
        {loading &&
            <div style={{display:"flex",width:"100%",justifyContent:"center",alignItems:"center"}}> 
                <Typography variant="h6" style={{ margin: "0 0 0 20px" }}>
                    Loading Data...
                </Typography>
                <CircularProgress
                style={{ margin: "0 0 0 20px", color: "darkblue" }}
                thickness={5}
                size={24}
                />
            </div>
        } 
        {!loading && university &&
            <div>
                <h1>{university.name}</h1>
                <h2>{university.viceChancellor?.universitySide.user.initials + " " + university.viceChancellor?.universitySide.user.surname}</h2>
                <h1>{university.address}</h1>
                <h1>{university.website}</h1>

                <div>
                  <h1>Center For Quality Assurance</h1>
                  <h2>{JSON.stringify(university.centerForQualityAssurance.contactNo)}</h2>
                  <h2>{JSON.stringify(university.centerForQualityAssurance.faxNo)}</h2>
                  <h2>{university.centerForQualityAssurance.email}</h2>

                  <h1>Center For Quality Assurance Director</h1>

                  <h2>{university.centerForQualityAssurance.currentCQADirector?.qualityAssuranceStaff.universitySide.user.initials + " " + university.centerForQualityAssurance.currentCQADirector?.qualityAssuranceStaff.universitySide.user.surname}
                    <img src={SERVER_URL.substring(0, SERVER_URL.length - 1) + university.centerForQualityAssurance.currentCQADirector?.qualityAssuranceStaff.universitySide.user.profilePic} target="_blank" rel="noreferrer"/>
                  </h2>
                </div>
            </div>
        }
      </>
  )
}

export default ViewUniversity
