import useSetUserNavigations from '../hooks/useSetUserNavigations';
import Button from '@mui/material/Button';
import createEvidence from '../api/Evidence/createEvidence';
import { useParams } from 'react-router-dom';

const PopupAdd = ({ toggle, closeToggle, standard, refreshEvidences }) => {

  const standardId = standard?.id;

  const {serId} = useParams();

  useSetUserNavigations([
    {
      name: 'Self Evaluation Report',
      link: '/Self Evaluation Report',
    },
  ]);

  const handleEvidenceSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('standardId', standardId);

    const applicableYears = [];
    //add applicableYears as an array to formData
    for (let i = 1; i <= 5; i++) {
      if (formData.get(`year${i}`) === 'on') {
        applicableYears.push(i);

        formData.delete(`year${i}`);
      }
    }

    //create a json object from formData
    const evidence = {};
    formData.forEach((value, key) => {
      evidence[key] = value;
    });

    //add applicableYears to evidence
    evidence['applicableYears'] = applicableYears;
    evidence['selfEvaluationReportId'] = serId;


    if(evidence.evidenceCode === '' || evidence.evidenceName === '' || evidence.url === '' || evidence.applicableYears.length === 0){
      alert('Please fill all the fields');
      return;
    }

    try{
      const resultRes = await createEvidence(evidence);

      if(resultRes && resultRes.status === 201){
        console.log(resultRes);
        alert('Evidence added successfully');
        refreshEvidences(); //to display the newly added evidence
        closeToggle();
      }
    }
    catch(error){
      console.log(error);
    }
  }


  return (
    <>
      {toggle && (
        <div className="popup-overlay" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '1' }}>
          <div className="popup-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)' }}>
            <div className='header' style={{ textAlign: 'center', fontWeight: 'bold' }}>
              <h2>Add Evidence</h2>
            </div>
            <br></br>
            <form className='body' onSubmit={handleEvidenceSubmit}>
              <div>
                <label>Standard No: </label>
                {standard?.standardNo}
              </div>
              <br></br>
              <div>
                <label>Evidence Code:</label>
                <input type="text" style={{ border: '1px solid black', padding: '5px', marginLeft: '20px' }} name={'evidenceCode'} />
              </div>
              <br></br>
              <div>
                <label>Evidence Name:</label>
                <input type="text" style={{ border: '1px solid black', padding: '5px', marginLeft: '15px' }} name='evidenceName' />
              </div>
              <br></br>
              <div>
                <label>Applicable Years:</label>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', margin: '20px', }}>
                <label>Y1</label>
                <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} value={'on'} name={'year1'} />
                <label>Y2</label>
                <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} value={'on'} name={'year2'}/>
                <label>Y3</label>
                <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} value={'on'} name={'year3'}/>
                <label>Y4</label>
                <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} value={'on'} name={'year4'}/>
                <label>Y5</label>
                <input type="checkbox" style={{ width: '15px', height: '15px', marginRight: '10px', border: '1px solid black', }} value={'on'} name={'year5'}/>
              </div>
              <br></br>
              <div>
                <label>URL:</label>
                <input type="text" style={{ border: '1px solid black', padding: '5px', marginLeft: '85px' }} name={'url'}/>
              </div>
              <br/>
              <div style={{ marginLeft: '80px' }} >
                <Button variant="contained" style={{ marginRight: '10px' }} type={"submit"}>
                  Submit
                </Button>
                <Button onClick={closeToggle} variant="contained" color="error" style={{ marginRight: '10px' }}>Close</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PopupAdd;
