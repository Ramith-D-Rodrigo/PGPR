import React from 'react';
import Form from '../../components//Form';
import ScrollableDiv from '../../components/ScrollableDiv';
import TestForm from '../../components/TestForm';
import handlePGPRApplicationCreation from '../../api/Dean/handlePGPRApplicationCreation';

const PGPRApplication = () => {
  return (
    <ScrollableDiv height="80vh">
        <TestForm
            topic="PGPR Application"
            fields={[
                {label: "PostGraduate Programme", name: "postgraduateProgramId", type: "select", isReadonly: false, options: [{label: "MSc in Computer Science", value: "1"}, {label: "MSc in Information Technology", value: "2"}]},
                {label: "Professional Postgraduate Programme", name: "isProfessionalDegreeProgramme", type: "checkbox", isReadonly: true, options: [{label: "Yes", value: "1"}]},
                {label: "SLQF Level", name: "slqfLevel", type: "text", isReadonly: true},
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