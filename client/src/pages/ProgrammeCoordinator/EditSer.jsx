// EditSer.js
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import getStandardsForSER from '../../api/SelfEvaluationReport/getStandardsForSER';
import getStandardEvidencesAndAdherenceForSER from '../../api/SelfEvaluationReport/getStandardEvidencesAndAdherenceForSER';
import PopupAdd from '../../components/PopUpAdd';
import EvidencePopUp from '../../components/PopUpUpdate';
import addAdherenceToStandard from '../../api/SelfEvaluationReport/addAdherenceToStandard';



const EditSer = () => {
  //getting the criteriaId and serId from the url
  const { criteriaId, serId } = useParams();

  //getting the applicable standards for the given criteriaId and serId
  const [applicableStandards, setApplicableStandards] = useState([]);

  //getting the evidences and adherence for the selected standard
  const [standardEvidencesAndAdherence, setStandardEvidencesAndAdherence] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const gettingStandards = async () => {
      try {
        const response = await getStandardsForSER(serId, criteriaId);

        if (response && response.status === 200) {
          console.log(response.data.data);
          setApplicableStandards(response.data.data);
          setIsLoaded(true);
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    gettingStandards();
  }, [criteriaId, serId]);

  const [selectedStandard, setSelectedStandard] = useState(null);

  const getEvidencesAdherence = async () => {
    try {
      if (selectedStandard == null) {
        return;
      }
      const response = await getStandardEvidencesAndAdherenceForSER(serId, selectedStandard.id);

      if (response && response.status === 200) {
        console.log(response.data.data);
        setStandardEvidencesAndAdherence(response.data.data);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getEvidencesAdherence();
  }, [selectedStandard, serId]);

  //adding evidence popup
  const [toggleEvidencePopUp, setToggleEvidencePopUp] = useState(false);
  const closePopUp = () => {
    setToggleEvidencePopUp(false);
  }

  const openPopUp = () => {
    setToggleEvidencePopUp(true);
  }

  //viewing evidence popup
  const [toggleEvidenceViewPopUp, setToggleEvidenceViewPopUp] = useState(false);
  const [viewingEvidence, setViewingEvidence] = useState(null);

  const openEvidenceViewPopUp = () => {
    setToggleEvidenceViewPopUp(true);
  }

  const closeEvidenceViewPopUp = () => {
    setViewingEvidence
    setToggleEvidenceViewPopUp(false);
  }


  //save adherence
  const handleSaveAdherence = async (e) => {
    e.preventDefault();

    if(selectedStandard == null){
      alert('Please select a standard');
      return;
    }

    if(standardEvidencesAndAdherence.standardAdherence === '' || standardEvidencesAndAdherence.standardAdherence === null){
      alert('Please fill the adherence field');
      return;
    }

    const formData = new FormData(e.target);

    const request = {};
    request.adherence = formData.get('standardAdherence');
    request.standardId = selectedStandard.id;

    console.log(request);

    try {
      const response = await addAdherenceToStandard(serId, request);

      if (response && response.status === 201) {
        alert('Adherence added successfully');
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    isLoaded &&
    <div className="app-container" style={{ display: 'flex', flexDirection: 'row' }}>
      <PopupAdd closeToggle={closePopUp} toggle={toggleEvidencePopUp} standard={selectedStandard} refreshEvidences={getEvidencesAdherence}/>
      <EvidencePopUp closeToggle={closeEvidenceViewPopUp} toggle={toggleEvidenceViewPopUp} standard={selectedStandard} evidence={viewingEvidence} refreshEvidences={getEvidencesAdherence} />
      <Sidebar sideBarItems={applicableStandards} setSelectedStandard={setSelectedStandard} />
      <form className="content" style={{ marginTop: '20px', marginLeft: '40px' }} onSubmit={handleSaveAdherence}>

        <div className='text-box' style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'rgb(216, 230, 252)', textAlign: 'center', width: '40px' }}>
          {selectedStandard?.standardNo}
        </div>
        <br></br>
        <div>
          {applicableStandards?.filter(standard => standard.id === selectedStandard?.id)[0]?.description}
        </div>
        <br></br>
        <div className='text-box' style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'rgb(216, 230, 252)', textAlign: 'center', width: '200px' }}>
          University adhere to Standards
        </div>
        <br></br>
        <div className="box" style={{ border: '1px solid #000', padding: '10px', backgroundColor: '#f0f0f0', display: 'flex' }}>
          <input type="text" className="input-field" style={{ border: 'none', outline: 'none', padding: '5px', height: '100px', background: 'transparent' }} name='standardAdherence' value={standardEvidencesAndAdherence?.standardAdherence?.adherence || ''}
            onChange={(e) => {
              setStandardEvidencesAndAdherence({
                ...standardEvidencesAndAdherence,
                standardAdherence: e.target.value
              })
            }} />
        </div>
        <br></br>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className='text-box' style={{ border: '1px solid #000', padding: '5px', backgroundColor: 'rgb(216, 230, 252)', textAlign: 'center', width: '200px' }}>
            Documentary Evidences
          </div>
          <Button variant="contained" style={{ marginLeft: '10px', backgroundColor: 'blue' }} onClick={() => openPopUp()}>
            Add Evidences
          </Button>
        </div>
        <br></br>
        <div className="box" style={{ border: '1px solid #000', padding: '10px', backgroundColor: '#f0f0f0', display: 'flex' }}>
          {
            standardEvidencesAndAdherence?.evidences?.length === 0 ? ("No evidences have been uploaded yet.") :
              standardEvidencesAndAdherence?.evidences?.map(evidence => {
                return (
                  <Button key={evidence.id} onClick={() => {
                    setViewingEvidence(evidence);
                    openEvidenceViewPopUp();
                  }}>
                    {evidence.evidenceCode + " " + evidence.evidenceName}
                  </Button>
                )
              })
          }
        </div>
        <br></br>
        <div style={{ alignItems: 'center', marginLeft: '300px' }}>
          <Button variant="contained" style={{ marginRight: '10px', backgroundColor: '#aad250' }} type='submit'>
            Save
          </Button>
          <Button variant="contained" style={{ marginRight: '10px', backgroundColor: '#c94646' }}>
            Cancel
          </Button>
        </div>
        <br></br>
        <div style={{ alignItems: 'center', marginLeft: '295px' }}>
          <Button variant="contained" style={{ marginRight: '10px', backgroundColor: '#a2cbea' }}>
            Go to the Application
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditSer;
