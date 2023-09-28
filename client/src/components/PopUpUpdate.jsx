import useSetUserNavigations from '../hooks/useSetUserNavigations';
import Button from '@mui/material/Button';
import deleteEvidence from '../api/Evidence/deleteEvidence';

const EvidencePopUp = ({ toggle, closeToggle, standard, evidence, refreshEvidences }) => {

  const standardId = standard?.id;


  const handleEvidenceDelete = async (e) => {
    e.preventDefault();
    try{
      const deleteResponse = await deleteEvidence(evidence.id);

      if(deleteResponse && deleteResponse.status === 200){
        console.log(deleteResponse.data);
        alert("Deleted successfuly");

        refreshEvidences(); //to clear the evidence from the display box

        closeToggle();
      }
      else{
        alert("Unable to delete the evidence");
        closeToggle();
      }
    }
    catch(error){
      console.log(error);
    }
  }

  useSetUserNavigations([
    {
      name: 'Self Evaluation Report',
      link: '/Self Evaluation Report',
    },
  ]);
  return (
<>
      {toggle && (
        <div className="popup-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '1' }}>
          <div className="popup-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}>
            <div className='header' style={{ textAlign: 'center', fontWeight: 'bold' }}>
              <h2>Evidence Details</h2>
            </div>
            <br></br>
            <form className='body' onSubmit={handleEvidenceDelete}>
              <div>
                <label>Standard No: </label>
                {standard?.standardNo}
              </div>
              <br></br>
              <div>
                <label>Evidence Code:</label>
                <input type="text" style={{ border: '1px solid black', padding: '5px', marginLeft: '20px' }} name={'evidenceCode'} readOnly value={evidence?.evidenceCode}/>
              </div>
              <br></br>
              <div>
                <label>Evidence Name:</label>
                <input type="text" style={{ border: '1px solid black', padding: '5px', marginLeft: '15px' }} name='evidenceName' readOnly value={evidence?.evidenceName}/>
              </div>
              <br></br>
              <div>
                <label>Applicable Years:</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', margin: '20px', }}>
                <label>Y1</label>
                <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} value={'on'} name={'year1'} readOnly checked={evidence?.applicableYears?.includes(1)}/>
                <label>Y2</label>
                <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} value={'on'} name={'year2'} readOnly checked={evidence?.applicableYears?.includes(2)}/>
                <label>Y3</label>
                <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} value={'on'} name={'year3'} readOnly checked={evidence?.applicableYears?.includes(3)}/>
                <label>Y4</label>
                <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} value={'on'} name={'year4'} readOnly checked={evidence?.applicableYears?.includes(4)}/>
                <label>Y5</label>
                <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} value={'on'} name={'year5'} readOnly checked={evidence?.applicableYears?.includes(5)}/>
              </div>
              <br></br>
              <div>
                <label>URL:</label>
                  <a href={evidence?.url} target="_blank" rel="noreferrer">{evidence?.url}</a>
              </div>
              <br/>
              <div style={{ marginLeft: '80px' }} >
                <Button variant="contained" color="error" style={{ marginRight: '10px' }} type={"submit"}>
                  Delete
                </Button>
                <Button onClick={closeToggle} variant="contained" style={{ marginRight: '10px' }}>Close</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EvidencePopUp;
