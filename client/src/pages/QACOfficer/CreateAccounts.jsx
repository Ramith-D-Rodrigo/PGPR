import React from 'react'
import ScrollableDiv from '../../components/ScrollableDiv'
import { Form } from 'react-router-dom'
import FormField from '../../components/FormField'

const CreateAccounts = () => {

  return (
    <>
        <ScrollableDiv height="70vh">
            <FormField label={"Account For"} type={"select"}key={"VCCQA"} options={[
                {name: "vc", value: "vice_chancellor", label: "Vice Chancellor"},
                {name: "cqa", value: "cqa_director", label: "CQA Director"},
            ]}/>
        </ScrollableDiv>
    </>
  )
}

export default CreateAccounts