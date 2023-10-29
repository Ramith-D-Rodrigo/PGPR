import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import getAllPGPRApplications from '../../api/PostGraduateProgramApplication/getAllPGPRApplications';
import getAllPGPRs from '../../api/PostGraduateProgramReview/getAllPGPRs';
import Card from '../../components/DashboardCard';

const QACOfficerDashboard = () => {

    const { auth } = useAuth();

    const [appliedPGPRApplicationsCount, setAppliedPGPRApplicationsCount] = useState(0);
    const [currentPlanningPGPRCount, setCurrentPlanningPGPRCount] = useState(0);
    const [currentSERSubmittedPGPRCount, setCurrentSERSubmittedPGPRCount] = useState(0);
    const [currentDEPGPRCount, setCurrentDEPGPRCount] = useState(0);
    const [aboutToEndDEPGPRCount, setAboutToEndDEPGPRCount] = useState(0);
    const [currentPEPGPRCount, setCurrentPEPGPRCount] = useState(0);
    const [aboutToEndPEPGPRCount, setAboutToEndPEPGPRCount] = useState(0);
    const [currentFinalPGPRCount, setCurrentFinalPGPRCount] = useState(0);
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);

    const LEAST_NUM_DAYS_TO_CONSIDER_AS_SOON_ENDING = 7;

    const dateDiff = (date1, date2) => {
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }


    useEffect(() => {
        const getData = async () => {

            const applicationResponse = await getAllPGPRApplications().then(response => {
                if (response.status === 200) {
                    const count = response.data.data.filter(application => application.status == 'applied').length;
                    setAppliedPGPRApplicationsCount(count);
                    setLoading1(false);
                }
            })

            const pgprResponse = getAllPGPRs({
                includePE: true,
                includeDE: true
            }).then(response => {
                if (response.status === 200) {

                    console.log(response.data.data);
                    let count = response.data.data.filter(pgpr => pgpr.statusOfPgpr == 'PLANNING').length;
                    setCurrentPlanningPGPRCount(count);

                    count = response.data.data.filter(pgpr => pgpr.statusOfPgpr == 'SUBMITTED').length;
                    setCurrentSERSubmittedPGPRCount(count);

                    count = response.data.data.filter(pgpr => pgpr.statusOfPgpr == 'DE').length;
                    setCurrentDEPGPRCount(count);
                    let soonEndingDECount = response.data.data.filter(pgpr => pgpr.statusOfPgpr == 'DE').filter(pgpr => dateDiff(new Date(pgpr.deskEvaluation.endDate), new Date()) < LEAST_NUM_DAYS_TO_CONSIDER_AS_SOON_ENDING).length;
                    setAboutToEndDEPGPRCount(soonEndingDECount);

                    count = response.data.data.filter(pgpr => pgpr.statusOfPgpr == 'PE1' || pgpr.statusOfPgpr == 'PE2').length;
                    setCurrentPEPGPRCount(count);

                    let soonEndingPECount = response.data.data.filter(pgpr => pgpr.statusOfPgpr == 'PE1' || pgpr.statusOfPgpr == 'PE2').filter(pgpr => dateDiff(new Date(pgpr.properEvaluation.endDate), new Date()) < LEAST_NUM_DAYS_TO_CONSIDER_AS_SOON_ENDING).length;
                    setAboutToEndPEPGPRCount(soonEndingPECount);

                    count = response.data.data.filter(pgpr => pgpr.statusOfPgpr == 'FINAL').length;
                    setCurrentFinalPGPRCount(count);
                    setLoading2(false);

                }
            })



        }
        getData();



    }, []);


    return (
        <>
            {
                !loading1 && !loading2 &&

                <Grid container rowSpacing={6} spacing={4} justifyContent="center" alignItems="center" columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
                    <Grid key={0} item>

                        <Card
                            title={"Applied Postgraduate Programme Review Applications"}
                            content={"There are " + appliedPGPRApplicationsCount + " applied postgraduate programme review applications"}
                            message={appliedPGPRApplicationsCount !== 0 ? "Your action is  required to approve or reject the applications" : ""}
                        />
                    </Grid>

                    <Grid key={1} item>

                        <Card
                            title={"Planning Postgraduate Programme Reviews"}
                            content={"There are " + currentPlanningPGPRCount + " postgraduate programme reviews in planning stage"}
                            message={currentPlanningPGPRCount !== 0 ? "Make sure that you have assigned a review team to each of these reviews" : ""}
                        />
                    </Grid>

                    <Grid key={2} item>

                        <Card
                            title={"Submitted Postgraduate Programme Reviews"}
                            content={"There are " + currentSERSubmittedPGPRCount + " postgraduate programme reviews that have submitted their self evaluation reports"}
                            message={currentSERSubmittedPGPRCount !== 0 ? "Review Team must be assigned and accepted by the university to proceed to the Desk Evaluation stage" : ""}
                        />
                    </Grid>

                    <Grid key={3} item>

                        <Card
                            title={"Postgraduate Programme Reviews in Desk Evaluation Stage"}
                            content={"There are " + currentDEPGPRCount + " postgraduate programme reviews in desk evaluation stage"}
                            message={aboutToEndDEPGPRCount !== 0 ? "There are " + aboutToEndDEPGPRCount + " postgraduate programme reviews that are about to end desk evaluation stage" : ""}
                        />
                    </Grid>

                    <Grid key={4} item>

                        <Card
                            title={"Postgraduate Programme Reviews in Proper Evaluation Stage"}
                            content={"There are " + currentPEPGPRCount + " postgraduate programme reviews in proper evaluation stage"}
                            message={aboutToEndPEPGPRCount !== 0 ? "There are " + aboutToEndPEPGPRCount + " postgraduate programme reviews that are about to end proper evaluation stage" : ""}
                        />
                    </Grid>

                    <Grid key={5} item>

                        <Card
                            title={"Postgraduate Programme Reviews in Final Stage"}
                            content={"There are " + currentFinalPGPRCount + " postgraduate programme reviews in final stage"}
                            message={currentFinalPGPRCount !== 0 ? "Review teams must be processing the reports at this time, make sure this is properly checked" : ""}
                        />
                    </Grid>

                </Grid>
            }


        </>
    )
}

export default QACOfficerDashboard