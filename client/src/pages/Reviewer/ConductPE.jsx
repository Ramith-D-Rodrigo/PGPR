import React from 'react'
import { useParams } from 'react-router-dom'
import useSetUserNavigations from '../../hooks/useSetUserNavigations';
import ScrollableDiv from '../../components/ScrollableDiv';
import DiscriptiveDiv from '../../components/DiscriptiveDiv';
import { useState } from 'react';

const ConductPE = () => {
    const {id} = useParams();
    useSetUserNavigations(
        [
            {
                name: "PG Assignments",
                link: "/PG_Assignments"
            },
            {
                name: "Conduct PE",
                link: "/PG_Assignments/Conduct_PE/"+id
            }
        ]
    );

    let descriptionWidth = 30;

    const [expand, setexpand] = useState(8);

    let newHeight = open ==true? `${90-expand}%` : `calc( ${90-expand}% - 40px )`;
    const handleClick = ()=>{
        if(expand==8)
        {
        setexpand(descriptionWidth);
        }
        else{
        setexpand(8);
        }
    };

    return (
        <>
            <DiscriptiveDiv onClick={handleClick} expand={expand==8? 1:2} description="Reviewer" width='100%' height={`${expand}%`} backgroundColor="#D9D9D9" >
            
            </DiscriptiveDiv>
            
            <DiscriptiveDiv description="Desk Evaluation" width='100%' height={newHeight} backgroundColor="#D9D9D9" >
                <ScrollableDiv width="100%" height="500px">
                    <div>
                        conduct PE {id}
                    </div>
                </ScrollableDiv>
            </DiscriptiveDiv>
        </>
    )
}

export default ConductPE

