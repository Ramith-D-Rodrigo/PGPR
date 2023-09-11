import { Divider } from '@mui/material';
import React from 'react'
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import getPGPR from '../../api/PostGraduateProgramReview/getPGPR';
import { Button } from '@mui/material';

const ViewPGPR = () => {
    const { id } = useParams();

    const [pgpr, setPgpr] = useState(null);

    useEffect(() => {
        const pgprResults = async () => {
            try{
                const pgprResults = await getPGPR(id);

                if(pgprResults.status){
                    setPgpr(pgprResults.data.data);
                    console.log(pgprResults.data.data);
                }
            
            }
            catch(error){
                console.log(error);
            }

        }
        pgprResults();
    }, []);

    //we have to get the final report separately

    return (
        <>
            <h1>Details of Post Graduate Program Review</h1>

            <Divider/>

            <h1>General Details</h1>

            University Name : {pgpr?.postGraduateProgramme.faculty.university.name}
            <br/>

            Faculty Name : {pgpr?.postGraduateProgramme.faculty.name}
            <br/>

            Post Graduate Program Name : {pgpr?.postGraduateProgramme.title}
            <br/>

            PGPR ID : {"PGPR-" + pgpr?.id}
            <br/>

            Programme Coordinator : {pgpr?.selfEvaluationReport.programmeCoordinator.academicStaff.universitySide.user.surname + " " + pgpr?.selfEvaluationReport.programmeCoordinator.academicStaff.universitySide.user.initials}
            <br/>

            Grouped Status : {pgpr?.groupedWith ? "Grouped" : "Not Grouped"}
            <br/>

            Status of PGPR : {pgpr?.statusOfPgpr}
            <br/>

            Payment Voucher : {pgpr?.paymentVoucher ? (
                <Button>
                    View Payment Voucher
                </Button>
            ) : "Not Uploaded"}
            <br/>

            Action Plan :   {pgpr?.actionPlan ? "Uploaded" : "Not Uploaded"}
            <br/>

            Preliminary Report :    {pgpr?.preliminaryReport ? "Uploaded" : "Not Uploaded"}
            <br/>

            Final Report :
            <br/>


        
        </>
    )
}

export default ViewPGPR