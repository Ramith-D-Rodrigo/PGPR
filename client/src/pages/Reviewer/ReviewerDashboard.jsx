import { useEffect, useState } from "react";
import Dashboard from "../../components/Dashboard"

function ReviewerDashboard() {

    const [contents,setContents] = useState([]);

    useEffect(() => {
        document.title = "Reviewer Dashboard";
        const data = [
            {
                title: 'No of Applications currently reviewing',
                content: '2023 Mar 30 - 2023 Jult 30',
                message: '4 PGPRs'
            },
            {
                title: 'On Going Desk Evaluations',
                content: '2023 Mar 30 - 2023 Jult 30',
                message: '2 PGPRs'
            },
            {
                title: 'PE Reviews This Week',
                content: '2023 Mar 30 - 2023 Jult 30',
                message: '2 PGPRs'
            },
            {
                title: 'New Assignments',
                content: '2023 Mar 30 - 2023 Jult 30',
                message: 'Ends in 4 Days'
            },
            {
                title: 'PE Meetings This Week',
                content: '2023 Mar 30 - 2023 Jult 30',
                message: '1 PG Programmes'
            },
            {
                title: 'Requested Applications',
                content: '2023 Mar 30 - 2023 Jult 30',
                message: '1 PG Programmes'
            },
        ];
        setContents(data);
    }, []);


    return (
        <Dashboard contents={contents} />
    )
}

export default ReviewerDashboard