const createSERRows = (Criterias,evidencesForGivenStandards,createRow) => {
    const rows = Criterias?.map((criteria,index)=>{
        let noOfStandards = criteria?.standards?.length;
        let noOfSubmittedStandards = 0;
        let evidencesCount = [0,0,0,0,0,0]; // 1:Y1, 2:Y2, 3:Y3, 4:Y4, 5:Y5
        criteria?.standards?.forEach((standard,index)=>{
            let standardId = standard?.id;
            evidencesForGivenStandards?.forEach((givenStandard,index)=>{
                if(givenStandard?.id == standardId)
                {
                    noOfSubmittedStandards++;
                    const evidences = givenStandard?.evidences;
                    evidences?.forEach((evidence,index)=>{
                        const applicableYears = evidence?.applicableYears;
                        applicableYears?.forEach((year,index)=>{
                            evidencesCount[year]++;
                        });
                    });
                    return;
                }
            });
        });
        const criteriaData = {name:criteria?.name,id:criteria?.id};
        return createRow(criteriaData,`${noOfSubmittedStandards}/${noOfStandards}`, evidencesCount[1],evidencesCount[2],evidencesCount[3],evidencesCount[4],evidencesCount[5]);
    });
    return rows;
};

export default createSERRows;