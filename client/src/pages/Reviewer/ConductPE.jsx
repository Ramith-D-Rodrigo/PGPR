import { useEffect, useState } from "react";
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
  Divider,
  Chip,
} from "@mui/material";

import DiscriptiveDiv from "../../components/DiscriptiveDiv";
import useSetUserNavigations from "../../hooks/useSetUserNavigations";
import getAssignedPGPRs from "../../api/Reviewer/getAssignedPGPR";
import getSelfEvaluationReport from "../../api/SelfEvaluationReport/getSelfEvaluationReport";
import getPGPR from "../../api/PostGraduateProgramReview/getPGPR";

const ConductPE = () => {
  const { pgprId } = useParams();

  useSetUserNavigations([
    {
      name: "PG Assignments",
      link: "/PG_Assignments",
    },
    {
      name: "Proper Evaluation",
      link: `/PG_Assignments/Conduct_PE/${pgprId}`,
    },
  ]);

  // const headerInfo = [
  //   { label: "University:", value: "University of Colombo" },
  //   {
  //     label: "Faculty/Institute:",
  //     value: "University of Colombo School of Computing",
  //   },
  //   { label: "PGPR ID:", value: decodedPgprId },
  //   { label: "PGPR Name:", value: "MSc" },
  //   { label: "Application Start Date:", value: "12/12/2020" },
  //   { label: "Submission Date:", value: "01/01/2021" },
  //   { label: "Program Coordinator:", value: "Mr. Smantha Karunanayake" },
  // ];

  // const rows = [
  //   {
  //     name: "John Doe",
  //     designation: "Professor",
  //     status: "Reviewer",
  //     listOfCriteria: [
  //       "Programme Evaluation",
  //       "Student Assessment & Awards",
  //       "Innovative & Healthy Practices",
  //     ],
  //   },
  //   {
  //     name: "Jane Smith",
  //     designation: "Associate Professor",
  //     status: "Reviewer",
  //     listOfCriteria: ["Programme Management", "P. Design and Development"],
  //   },
  //   {
  //     name: "Michael Johnson",
  //     designation: "Assistant Professor",
  //     status: "Chair",
  //     listOfCriteria: [
  //       "Human Physical Res. & LS",
  //       "Teaching Learning Research",
  //     ],
  //   },
  // ];

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [pgpr, setPgpr] = useState(null);
  const [SERDetails, setSERDetails] = useState(null);
  const [pg, setPg] = useState(null);

  useEffect(() => {
    document.title = "Conduct Proper Evaluation";
    const getSpecificPGPR = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const response = await getAssignedPGPRs(pgprId);
        console.log("PGPR : ", response?.data?.data);
        setPgpr(response?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const getPgpr = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const response = await getPGPR(pgprId);
        console.log("PG : ", response?.data?.data);
        setPg(response?.data?.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    const getSERDetails = async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const response = await getSelfEvaluationReport(pgprId);
        console.log("SER Details : ", response?.data?.data);
        setSERDetails(response?.data?.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getPgpr();
    getSERDetails();
    getSpecificPGPR();
  }, [pgprId]);

  // function createData(
  //   pgprID,
  //   University_Name,
  //   faculty_Name,
  //   pgp,
  //   Role,
  //   status,
  //   Actions
  // ) {
  //   Actions = Actions.map((action, index) => {
  //     let allow = action.allow ? { disabled: false } : { disabled: true };
  //     allow = loading ? { disabled: true } : allow;
  //     if (action.action === "View") {
  //       return (
  //         <Link key={index} to={action.allow ? "ViewSer/" + pgprID : ""}>
  //           <Button
  //             {...allow}
  //             style={{ margin: "0 8px" }}
  //             variant="contained"
  //             color="primary"
  //             size="small"
  //           >
  //             {action.action}
  //           </Button>
  //         </Link>
  //       );
  //     } else if (action.action === "Accept") {
  //       return (
  //         <Button
  //           key={index}
  //           onClick={() => {
  //             handleClickAccept(pgprID);
  //           }}
  //           {...allow}
  //           style={{ margin: "0 8px" }}
  //           variant="contained"
  //           color="primary"
  //           size="small"
  //         >
  //           {action.action}
  //         </Button>
  //       );
  //     } else if (action.action === "DE") {
  //       return (
  //         <Link key={index} to={action.allow ? "Conduct_DE/" + pgprID : ""}>
  //           <Button
  //             {...allow}
  //             style={{ margin: "0 8px" }}
  //             variant="contained"
  //             color="primary"
  //             size="small"
  //           >
  //             {action.action}
  //           </Button>
  //         </Link>
  //       );
  //     } else if (action.action === "PE") {
  //       return (
  //         <Link key={index} to={action.allow ? "Conduct_PE/" + pgprID : ""}>
  //           <Button
  //             {...allow}
  //             style={{ margin: "0 8px" }}
  //             variant="contained"
  //             color="primary"
  //             size="small"
  //           >
  //             {action.action}
  //           </Button>
  //         </Link>
  //       );
  //     }
  //   });
  //   return {
  //     pgprID: `PGPR-${pgprID}`,
  //     University_Name,
  //     faculty_Name,
  //     pgp,
  //     Role,
  //     status,
  //     Actions,
  //   };
  // }

  // const rows = pgpr
  //   ? pgpr?.map((pgpr) => {
  //       const PGPRDetails = pgpr?.postGraduateReviewProgram;
  //       const pgProgramme = PGPRDetails?.postGraduateProgramme;
  //       const faculty = pgProgramme?.faculty;
  //       const university = faculty?.university;
  //       let actions = [];
  //       if (
  //         PGPRDetails?.statusOfPgpr === "SUBMITTED" ||
  //         PGPRDetails?.statusOfPgpr === "PLANNING"
  //       ) {
  //         actions = [
  //           { action: "Accept", allow: true },
  //           { action: "View", allow: false },
  //           { action: "DE", allow: false },
  //           { action: "PE", allow: false },
  //         ];
  //       } else if (PGPRDetails?.statusOfPgpr === "DE") {
  //         actions = [
  //           { action: "Accept", allow: false },
  //           { action: "View", allow: true },
  //           { action: "DE", allow: true },
  //           { action: "PE", allow: false },
  //         ];
  //       } else if (
  //         PGPRDetails?.statusOfPgpr === "PE1" ||
  //         PGPRDetails?.statusOfPgpr === "PE2"
  //       ) {
  //         actions = [
  //           { action: "Accept", allow: false },
  //           { action: "View", allow: true },
  //           { action: "DE", allow: false },
  //           { action: "PE", allow: true },
  //         ];
  //       } else if (PGPRDetails?.statusOfPgpr === "FINAL") {
  //         actions = [
  //           { action: "Accept", allow: false },
  //           { action: "View", allow: true },
  //           { action: "DE", allow: false },
  //           { action: "PE", allow: false },
  //         ];
  //       } else if (PGPRDetails?.statusOfPgpr === "COMPLETED") {
  //         actions = [
  //           { action: "Accept", allow: false },
  //           { action: "View", allow: true },
  //           { action: "DE", allow: false },
  //           { action: "PE", allow: false },
  //         ];
  //       } else {
  //         actions = [
  //           { action: "Accept", allow: false },
  //           { action: "View", allow: false },
  //           { action: "DE", allow: false },
  //           { action: "PE", allow: false },
  //         ];
  //       }

  //       return createData(
  //         PGPRDetails?.id,
  //         university?.name,
  //         faculty?.name,
  //         pgProgramme?.title,
  //         pgpr?.role,
  //         PGPRDetails?.statusOfPgpr,
  //         actions
  //       );
  //     })
  //   : [];

  const finalButtons = [
    {
      title: "View Assigned Criteria",
      to: `../Assigned_criteria/${pgprId}`,
    },
  ];

  return (
    // <>
    //   <DiscriptiveDiv
    //     description="PG Program"
    //     width="100%"
    //     height="auto"
    //     backgroundColor="#D8E6FC"
    //   >
    //     <Grid container spacing={2}>
    //       {headerInfo.map((infoItem, index) => (
    //         <Grid item xs={12} sm={6} key={index}>
    //           <Typography variant="subtitle1">
    //             <b>{infoItem.label}</b>
    //           </Typography>
    //           <Typography>{infoItem.value}</Typography>
    //         </Grid>
    //       ))}
    //     </Grid>
    //   </DiscriptiveDiv>

    //   <Divider textAlign="left" sx={{ marginY: "1rem"}}>
    //     <Chip label="Proper Evaluation" />
    //   </Divider>

    //   <TableContainer component={Paper}>
    //     <Table sx={{ minWidth: 650 }} stickyHeader>
    //       <TableHead>
    //         <TableRow>
    //           <TableCell style={{ backgroundColor: "#D8E6FC" }} align="left">
    //             <b>Name</b>
    //           </TableCell>
    //           <TableCell style={{ backgroundColor: "#D8E6FC" }} align="center">
    //             <b>Designation</b>
    //           </TableCell>
    //           <TableCell style={{ backgroundColor: "#D8E6FC" }} align="center">
    //             <b>Status</b>
    //           </TableCell>
    //           <TableCell style={{ backgroundColor: "#D8E6FC" }} align="center">
    //             <b>List of Criterian</b>
    //           </TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {rows.map((row, index) => (
    //           <TableRow
    //             key={index}
    //             sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    //           >
    //             <TableCell component="th" scope="row">
    //               {row.name}
    //             </TableCell>
    //             <TableCell align="center">{row.designation}</TableCell>
    //             <TableCell align="center">{row.status}</TableCell>
    //             <TableCell align="center">
    //               <ul
    //                 style={{
    //                   listStyleType: "disc",
    //                   textAlign: "left",
    //                   paddingLeft: "20%",
    //                 }}
    //               >
    //                 {row.listOfCriteria.map((criteriaItem, index) => (
    //                   <li key={index}>
    //                     <Typography>{criteriaItem}</Typography>
    //                   </li>
    //                 ))}
    //               </ul>
    //             </TableCell>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>

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
    // </>
  );
};

export default ConductPE;