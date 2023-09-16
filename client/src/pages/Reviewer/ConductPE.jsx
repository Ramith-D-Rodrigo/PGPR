import { useParams, Link } from "react-router-dom";
import {
  Button,
  Grid,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
} from "@mui/material";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import DiscriptiveDiv from "../../components/DiscriptiveDiv";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useState } from "react";

const ConductPE = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [openDateDialog, setOpenDateDialog] = useState(false);
  const [openCriteriaDialog, setOpenCriteriaDialog] = useState(false);
  const [PEEndDate, setPEEndDate] = useState("");
  const { pgprId } = useParams();
  const decodedPgprId = decodeURIComponent(pgprId);
  const [criteriaList, setCriteriaList] = useState([
    {name:"Programme Evaluation",id:1},
    {name:"Student Assessment & Awards",id:2},
    {name:"Innovative & Healthy Practices",id:3},
    {name:"Programme Management",id:4},
    {name:"P. Design and Development",id:5},
    {name:"Human Physical Res. & LS",id:6},
    {name:"Teaching Learning Research",id:7},
  ]);
  const [selectedCriteriaList, setSelectedCriteriaList] = useState([
    {name:"Programme Management",id:4},
    {name:"P. Design and Development",id:5},
    {name:"Human Physical Res. & LS",id:6},
  ]);
  const [reviewerCreitriaList, setReviewerCreitriaList] = useState([]);
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [reviewer, setReviewer] = useState("Chair");
  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "PE",
      link: `/PG_Assignments/Conduct_PE/${decodedPgprId}`,
    },
  ]);

  const handleSetDate = (openDateDialog) => {
    console.log(openDateDialog);
    setPEEndDate("");
    setOpenDateDialog(false);
  }

  const HandleselectCriteria = (e,id) => {
    e.target.style.backgroundColor = "black";
    e.target.style.color = "white";
    //if already selected
    if(reviewerCreitriaList.some((criteria)=>criteria.id===id)){
      e.target.style.backgroundColor = "white";
      e.target.style.color = "black";
      setReviewerCreitriaList(reviewerCreitriaList.filter((criteria)=>criteria.id!==id));
      return;
    }
    setReviewerCreitriaList([...reviewerCreitriaList,{name:criteriaList.find((criteria)=>criteria.id===id).name,id:id}]);
  }

  const handlesetCriteria = () => {
    if(reviewerCreitriaList.length===0){
      alert("Please select at least one criteria");
      return;
    }
    console.log(reviewerCreitriaList);
    setOpenCriteriaDialog(false);
    setReviewerCreitriaList([]);
    //get PGPR data again
  }

  const headerInfo = [
    { label: "University:", value: "University of Colombo" },
    {
      label: "Faculty/Institute:",
      value: "University of Colombo School of Computing",
    },
    { label: "PGPR ID:", value: decodedPgprId },
    { label: "PGPR Name:", value: "MSc" },
    { label: "Application Start Date:", value: "12/12/2020" },
    { label: "Submission Date:", value: "01/01/2021" },
    { label: "Program Coordinator:", value: "Mr. Smantha Karunanayake" },
  ];

  const rows = [
    {
      name: "John Doe",
      designation: "Professor",
      status: "Reviewer",
      listOfCriteria: [
      ],
      actions: <Button onClick={()=>{setOpenCriteriaDialog(true),setSelectedReviewer({id:1,name:"john john"})}} variant="contained" size="small" style={{backgroundColor: "#A2CBEA", color: "black", fontWeight: "bold", textAlign: "center"}}>Update</Button>
    },
    {
      name: "Jane Smith",
      designation: "Associate Professor",
      status: "Reviewer",
      listOfCriteria: ["Programme Management", "P. Design and Development"],
      actions: <Button onClick={()=>{setOpenCriteriaDialog(true),setSelectedReviewer({id:1,name:"john john"})}} variant="contained" size="small" style={{backgroundColor: "#A2CBEA", color: "black", fontWeight: "bold", textAlign: "center"}}>Update</Button>
    },
    {
      name: "Michael Johnson",
      designation: "Assistant Professor",
      status: "Chair",
      listOfCriteria: [
        "Human Physical Res. & LS",
      ],
      actions: <Button onClick={()=>{setOpenCriteriaDialog(true),setSelectedReviewer({id:1,name:"john john"})}} variant="contained" size="small" style={{backgroundColor: "#A2CBEA", color: "black", fontWeight: "bold", textAlign: "center"}}>Update</Button>
    },
  ];

  const finalButtons = [
    {
      title: "Proceed to Proper Evaluation",
      to: `../Assigned_criteria/${decodedPgprId}`,
    },
  ];
  //only for chair
  if (reviewer === "Chair") {
    finalButtons.push(
      {
        title: "Set Dates for Proper Evaluation",
        to: "",
      },
    );
  }
  
  return (
    <>
      <DiscriptiveDiv
        description="PG Program"
        width="100%"
        height="auto"
        backgroundColor="#D8E6FC"
      >
        <Grid container spacing={2}>
          {headerInfo.map((infoItem, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Typography variant="subtitle1">
                <b>{infoItem.label}</b>
              </Typography>
              <Typography>{infoItem.value}</Typography>
            </Grid>
          ))}
        </Grid>
      </DiscriptiveDiv>

      <DiscriptiveDiv
        description="Proper Evaluation"
        width="100%"
        height="auto"
        backgroundColor="white"
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: "#D8E6FC" }} align="left">
                  <b>Name</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>Designation</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>Status</b>
                </TableCell>
                <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>List of Criterian</b>
                </TableCell>
                {
                  (reviewer==="Chair")?
                  <TableCell
                  style={{ backgroundColor: "#D8E6FC" }}
                  align="center"
                >
                  <b>Actions</b>
                </TableCell>
                :
                ""
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.designation}</TableCell>
                  <TableCell align="center">{row.status}</TableCell>
                  <TableCell align="center">
                    <ul
                      style={{
                        listStyleType: "disc",
                        textAlign: "left",
                        paddingLeft: "20%",
                      }}
                    >
                      {row.listOfCriteria.map((criteriaItem, index) => (
                        <li key={index}>
                          <Typography>{criteriaItem}</Typography>
                        </li>
                      ))}
                      {
                        (row.listOfCriteria.length===0)?
                        <li>
                          <Typography>No Criteria Selected</Typography>
                        </li>
                        :
                        ""
                      }
                    </ul>
                  </TableCell>
                  {
                    (reviewer==="Chair")?
                    <TableCell align="center">{row.actions}</TableCell>
                    :
                    ""
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DiscriptiveDiv>

      <Grid
        container
        justifyContent="space-around"
        alignItems="center"
        spacing={2}
        sx={{ padding: { xs: "10px 0", sm: "20px 0" } }}
      >
        {finalButtons.map((buttonItem, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Button
              onClick={(index===1)? ()=>setOpenDateDialog({id:decodedPgprId,startDate:"12/12/2020",endDate:"01/01/2021"}) : null}
              variant="contained"
              size="small"
              fullWidth
              style={{
                backgroundColor: "#A2CBEA",
                color: "black",
                fontWeight: "bold",
                textAlign: "center",
              }}
              component={Link}
              to={buttonItem.to}
            >
              {buttonItem.title}
            </Button>
          </Grid>
        ))}
      </Grid>

      <Dialog
          fullScreen={fullScreen}
          open={openDateDialog? true : false}
          onClose={()=>setOpenDateDialog(false)}
          aria-labelledby="Set-PE-Date"
      >
          <DialogTitle id="Set-PE-Date-ID">
          {`Set the Proper Evaluation Date for ${openDateDialog.id} postgraduate programme review`}
          </DialogTitle>
          <DialogContent>
              <p>Start Date : <strong>{openDateDialog.startDate}</strong></p>
              <p>End Date : <strong>{openDateDialog.endDate}</strong></p>
              <Box sx={{display:'flex',flexDirection:'column',justifyContent:'space-around',alignItems:'center',width:'100%',height:'100%',margin:"1rem 0"}}>
                  <TextField
                      id="setEndDate"
                      value={PEEndDate}
                      helperText="Please select the end date for the Proper Evaluation"
                      variant="standard"
                      onChange={(e)=>setPEEndDate(e.target.value)}
                      type="date"
                  />
              </Box>
          </DialogContent>
          <DialogActions>
          <Button autoFocus onClick={()=>setOpenDateDialog(false)}>
              cancel
          </Button>
          <Button onClick={()=>handleSetDate(openDateDialog)} autoFocus>
              Set Date
          </Button>
          </DialogActions>
      </Dialog>

      <Dialog
          fullScreen={fullScreen}
          open={openCriteriaDialog}
          onClose={()=>{setOpenCriteriaDialog(false);setReviewerCreitriaList([])}}
          aria-labelledby="Set-PE-Date"
      >
          <DialogTitle id="Set-PE-Date-ID">
          {`Select the criteria for ${selectedReviewer.name} :`}
          </DialogTitle>
          <DialogContent>
              <Box sx={{display:'flex',flexWrap:"wrap",justifyContent:'space-around',alignItems:'center',width:'100%',height:'100%',margin:"1rem 0"}}>
                  {
                      criteriaList.map((criteria,index)=>(
                        (selectedCriteriaList.some((selectedCriteria)=>selectedCriteria.id===criteria.id))?
                        ""
                        :
                        <Button key={index} onClick={(e)=>HandleselectCriteria(e,criteria.id)} style={{border:"1px solid black",borderRadius:"10px",padding:"0.4rem 0.5rem", margin:"0.5rem 0.5rem 0 0",color:"black"}}>{criteria.name}</Button>
                      ))
                  }
              </Box>
              <Box sx={{display:'flex',flexDirection:'column',justifyContent:'space-around',alignItems:'center',width:'100%',height:'100%',margin:"2rem 0"}}>
                  {reviewerCreitriaList.length>0 && <strong>Selected Criteria</strong>}
                  {
                      reviewerCreitriaList.map((criteria,index)=>(
                        <Button key={index} disabled style={{border:"1px solid black",borderRadius:"10px",padding:"0.4rem 0.5rem", margin:"0.5rem 0.5rem 0 0",backgroundColor:"darkblue",color:"white"}}>{criteria.name}</Button>
                      ))
                  }
              </Box>
          </DialogContent>
          <DialogActions>
          <Button autoFocus onClick={()=>{setOpenCriteriaDialog(false);setReviewerCreitriaList([])}}>
              cancel
          </Button>
          <Button onClick={()=>handlesetCriteria()} autoFocus>
              Set Criteria
          </Button>
          </DialogActions>
      </Dialog>
    </>
  );
};

export default ConductPE;
