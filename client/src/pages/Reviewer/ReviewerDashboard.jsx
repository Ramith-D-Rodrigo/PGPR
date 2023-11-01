import { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard"
import getAllPgprs from "../../api/Reviewer/getAllPgprs";
import GetAllDeEvaluations from "../../api/Reviewer/GetAllDeEvaluations";
import GetAllPeEvaluations from "../../api/Reviewer/GetAllPeEvaluations";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { CircularProgress } from "@mui/material";

function ReviewerDashboard() {

    const [contents,setContents] = useState([]);
    const [loading,setLoading] = useState(false);
    const [errorMsg,setErrorMsg] = useState("");
    const [successMsg,setSuccessMsg] = useState("");

    useEffect(() => {
        document.title = "Reviewer Dashboard";

        const getReviewerData = async()=>
        {
            try{
                setLoading(true);
                const response = await getAllPgprs();
                console.log("pgprs :",response?.data?.data);
                const response1 = await GetAllDeEvaluations();
                console.log("des :",response1);
                const response2 = await GetAllPeEvaluations();
                console.log("pes :",response2);

                let pgprs = [];
                let properEvaluationss = [];
                let deskEvaluations = [];

                if(response?.data?.data)
                {
                    pgprs = response?.data?.data;
                }
                if(response1?.data?.data)
                {
                    deskEvaluations = response1?.data?.data;
                }
                if(response2?.data?.data)
                {
                    properEvaluationss = response2?.data?.data;
                }
                setDashboardData(pgprs,deskEvaluations,properEvaluationss)
                setLoading(false);
            }
            catch(err){
                console.log(err);
                setErrorMsg(err?.response?.data?.message)
                setLoading(false);
            }
        }
        getReviewerData();
    }, []);

    const setDashboardData = (pgprs,deskEvaluation,properEvaluations) =>{
        const data = [
            {
                title: 'No of Applications currently reviewing',
                content: '',
                message: `${pgprs.filter((pgpr)=>{
                    return pgpr?.reviewerConfirmation == "ACCEPTED";
                }).length} PGPRs`
            },
            {
                title: 'On Going Desk Evaluations',
                content: '',
                message: `${deskEvaluation.length} PGPRs`
            },
            {
                title: 'PE Reviews This Week',
                content: '',
                message: `${properEvaluations.length} PGPRs`
            },
            {
                title: 'New Assignments',
                content: '',
                message: `${pgprs.filter((pgpr)=>{
                    return pgpr?.reviewerConfirmation != "ACCEPTED";
                }).length} PGPRs`
            },
        ];
        setContents(data);
    }


    return (
        <>
        {loading?

            <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100%"}}>
                <CircularProgress
                style={{ margin: "0 0 0 20px", color: "darkblue" }}
                thickness={5}
                size={40}
                />
            </div>
        :

        <>
            <Dashboard contents={contents} />

            <Snackbar
                open={errorMsg == "" ? false : true}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                onClose={() => setErrorMsg("")}
            >
                <Alert onClose={() => setErrorMsg("")} severity="error">
                    {errorMsg}
                </Alert>
            </Snackbar>
        </>
        }
        </>
    )
}

export default ReviewerDashboard