// this component is used for protected routes
import { Outlet, useLocation, Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import getSpecificPGPR from "../api/Reviewer/getSpecificPGPR";
import { useEffect, useState } from "react";
import {CircularProgress, Box, Typography} from '@mui/material';

const AuthorizeRoute = ({ allowedStage }) => {

  const { pgprId }   = useParams();
  const [isAllowed,setIsAllowed] = useState(-1);
  const location = useLocation(); // to redirect the user to where he/she came from

useEffect(() => {
  const getPgprResponse = async()=>{
    try {
      const response = await getSpecificPGPR(pgprId);
      // console.log("response",response?.data?.data?.postGraduateReviewProgram);

      const postgraduateProgram = response?.data?.data?.postGraduateReviewProgram;

      //check if the stage is DE and the desk evaluation is not started yet
      if(postgraduateProgram?.statusOfPgpr == "DE" && 
          postgraduateProgram?.deskEvaluation?.startDate == null && 
            postgraduateProgram?.deskEvaluation?.endDate == null)
            {
              setIsAllowed(false)
              return;
            }

      //check for stage PE1, PE2, and DE (started by chair)
      allowedStage.includes(postgraduateProgram.statusOfPgpr) ? setIsAllowed(true) : setIsAllowed(false);

    } catch (error) {
      console.log("error",error);
      setIsAllowed(false);
    }
  }

  getPgprResponse();
  
}, [pgprId]);


if(isAllowed == false)
  return <Navigate to="/Unauthorized" state={{ from: location }} replace />
else if(isAllowed == true)
  return <Outlet />
else 
  return <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      marginTop: "-10vh",
    }}
  >
    <Typography variant="h5" color="primary">
      Loading...
    </Typography>
    <CircularProgress size={50} thickness={3} />
  </Box>

};

AuthorizeRoute.propTypes = {
  allowedStage: PropTypes.array,
};

export default AuthorizeRoute;
