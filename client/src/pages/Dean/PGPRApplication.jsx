import React from 'react';
import Form from '../../components//Form';
import ScrollableDiv from '../../components/ScrollableDiv';
import TestForm from '../../components/TestForm';
import handlePGPRApplicationCreation from '../../api/Dean/handlePGPRApplicationCreation';
import getPostGraduateProgrammes from '../../api/Dean/getPostGraduateProgrammes';
import { useState, useEffect, useRef } from 'react';

const PGPRApplication = () => {
  const [pgps, setPGPs] = useState([]); //state variable to store the response data

  let selectedPGP = useRef("");
  let selectedSLQFLevel = useRef("");

  useEffect(() => {
    getPostGraduateProgrammes().then((res) => {
      setPGPs(res.data.data);
      console.log(res.data.data); //data is an array of objects
    })
    .then(() => {
      selectedPGP.current = pgps[0];
      selectedSLQFLevel.current = selectedPGP.current.slqfLevel;

      displaySLQFLevelForPGP({target: {value: selectedPGP.id}});
    }) ;
  }, []);


  const displaySLQFLevelForPGP = (event) => {
    selectedPGP.current = pgps.find((pgp) => pgp.id === event.target.value);
    selectedSLQFLevel.current = selectedPGP.current.slqfLevel;
  }


  return (
    <ScrollableDiv height="80vh">
        <TestForm
            topic="PGPR Application"
            fields={[
                {label: "PostGraduate Programme", name: "postgraduateProgramId", type: "select", isReadonly: false, 
                options: pgps.map((pgp) => ({label: pgp.title, value: pgp.id})),
                onchange: displaySLQFLevelForPGP,
                },
                {label: "Professional Postgraduate Programme", name: "isProfessionalDegreeProgramme", type: "checkbox", isReadonly: true, options: [{label: "Yes", value: "1"}]},
                {label: "SLQF Level", name: "slqfLevel", type: "text", isReadonly: true, value:{selectedSLQFLevel}},
                /*years should be a list of years*/
                {label: "Year 1", name: "year_1", type: "select", isReadonly: false, options: [{label: "Semester 1", value: "1"}, {label: "Semester 2", value: "2"}]},
                {label: "Year 2", name: "year_2", type: "select", isReadonly: false, options: [{label: "Semester 1", value: "1"}, {label: "Semester 2", value: "2"}]},
                {label: "Year 3", name: "year_3", type: "select", isReadonly: false, options: [{label: "Semester 1", value: "1"}, {label: "Semester 2", value: "2"}]},
                {label: "Year 4", name: "year_4", type: "select", isReadonly: false, options: [{label: "Semester 1", value: "1"}, {label: "Semester 2", value: "2"}]},
                {label: "Year 5", name: "year_5", type: "select", isReadonly: false, options: [{label: "Semester 1", value: "1"}, {label: "Semester 2", value: "2"}]},
                {label: "Year End", name: "yEnd", type: "date", isReadonly: false},
                {label: "Letter of Intent", name: "intentLetter", type: "file", isReadonly: false}
            ]}
            cancelButtonText="Cancel"
            submitButtonText="Submit"
            /*there should be a save button to add the intent letter and edit the programme application later */

            onCancel={() => {}}
            onSubmit={handlePGPRApplicationCreation}
        />
    </ScrollableDiv>

  )
}

export default PGPRApplication