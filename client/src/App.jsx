import { Route, Routes } from "react-router-dom";

import { DrawerStateProvider } from './contexts/DrawerStateProvider';
import { ReviewerRoleProvider } from "./contexts/ReviewerRoleProvider";

import Dashboard from "./components/Dashboard";
import MainLayout from "./components/MainLayout";
import Authenticate from "./components/Authenticate";
import Unauthorized from "./components/Unauthorized";
import LoginPersist from "./components/LoginPersist.jsx";
import ResetInitialPassword from "./components/ResetInitialPassword.jsx";
import View from './components/View';

import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import Universities from "./pages/QACOfficer/Universities";
import CreateAccounts from "./pages/QACOfficer/CreateAccounts";
import PostGraduateProgramReviewApplications from './pages/QACOfficer/PostGraduateProgramReviewApplications'
import Reviewers from "./pages/QACOfficer/Reviewers";
import ImportReviewers from "./pages/QACOfficer/ImportReviewers";
import PostGraduateProgramReviews from "./pages/QACOfficer/PostGraduateProgramReviews";
import ViewPGPR from "./pages/QACOfficer/ViewPGPR";

import CqaOffices from "./pages/QACDirector/CqaOffices";
import ViewUniversities from "./pages/QACDirector/ViewUniversities";
import ViewUniversity from "./pages/QACDirector/ViewUniversity";
import EditUniversity from "./pages/QACDirector/EditUniversity";
import AddUniversity from "./pages/QACDirector/AddUniversity";
import ViewReviewers from "./pages/QACDirector/ViewReviewers";

import AddPGProgramPage from './pages/CQAdirector/AddPGProgramPage';
import AddAccounts from './pages/CQAdirector/AddAccounts';
import EditPGProgram from './pages/CQAdirector/EditPGProgram';
import ViewPGPrograms from "./pages/CQAdirector/ViewPGPrograms";
import PGPrograms from "./pages/CQAdirector/PGPrograms";
import ViewCoordinators from "./pages/CQAdirector/ViewCoordinators";
import CoordinatorProfile from "./pages/CQAdirector/CoordinatorProfile";
import Faculties from "./pages/Faculty/Faculties"
import AddFaculty from "./pages/CQAdirector/AddFaculty";
import ViewFaculty from "./pages/Faculty/ViewFaculty";

import SubmitIntent from './pages/DeanDirector/SubmitIntent';
import SubmitConsent from './pages/DeanDirector/SubmitConsent';

import PGPRApplication from "./pages/Dean/PGPRApplication";
import PGPRApplications from "./pages/Dean/PGPRApplications";
import EditPGPRApplication from "./pages/Dean/EditPGPRApplication";

import SetDate from './pages/ReviewerChair/SetDate';
import SetCriteria from './pages/ReviewerChair/SetCriteria';
import FinalizeDE from "./pages/ReviewerChair/FinalizeDE";
import FinalizePE from "./pages/ReviewerChair/FinalizePE";
import DEProgress from "./pages/ReviewerChair/DEProgress";
import PEProgress from "./pages/ReviewerChair/PEProgress";
import EndDE from "./pages/ReviewerChair/EndDE";
import EndPE from "./pages/ReviewerChair/EndPE";

import PGAssignments from './pages/Reviewer/PGAssignments';
import ConductDE from './pages/Reviewer/ConductDE';
import ConductPE from './pages/Reviewer/ConductPE';
import SubmitDE from "./pages/Reviewer/SubmitDE";
import SubmitPE from "./pages/Reviewer/SubmitPE";
import AcceptAppointment from "./pages/Reviewer/AcceptAppointment";
import ViewSer from "./pages/Reviewer/ViewSer";
import EvaluateDE from "./pages/Reviewer/EvaluateDE";
import EvaluatePE from "./pages/Reviewer/EvaluatePE";
import PESummaryDetails from "./pages/Reviewer/PESummaryDetails";
import PEStandardwiseDetails from "./pages/Reviewer/PEStandardWiseDetails";
import ViewAssignedCriteria from "./pages/Reviewer/ViewAssignedCriteria";
import ReviewerDashboard from "./pages/Reviewer/ReviewerDashboard";
import Standardwise_details from "./pages/Reviewer/Standardwise_details";
import UpdateABC from "./pages/Reviewer/UpdateABC";
import Summary_details from "./pages/Reviewer/Summary_details";

import Ser from "./pages/ProgrammeCoordinator/Ser";
import SubmitPGPR from "./pages/ProgrammeCoordinator/SubmitPGPR";
import EditSer from "./pages/ProgrammeCoordinator/EditSer";
import AddEvidence from "./pages/ProgrammeCoordinator/AddEvidence";
import PGPRs from "./pages/PGPR/PGPRs";
// import UpdateEvidence from './pages/ProgrammeCoordinator/UpdateEvidence';
// import ViewSummary from './pages/ProgrammeCoordinator/ViewSummary';

import ViewPGPs from "./pages/IQAUdirector/ViewPGPrograms";
import IQAUSer from "./pages/IQAUdirector/Ser";
import IQAUEditSer from "./pages/IQAUdirector/EditSer";
import IQAUProgramDetails from "./pages/IQAUdirector/ViewProgramDetails";

import ViewPGProgrammesInUniversities from "./pages/ViceChancellor/ViewPGProgrammesInUniversities";
//import View from './pages/ViceChancellor/View';

import SelfEvaluationReport from "./pages/SelfEvaluationReport/SelfEvaluationReport";
import EditingSelfEvaluationReport from "./pages/SelfEvaluationReport/EditingSelfEvaluationReport";

import "./App.css";


/* 
  important: 
  please check before merge whether the import paths duplicated
  & please use the correct import path.
  if there is no imported path similar to the import path(by you), please remove the import path
  & instead do the changes into file already in there.
*/

function App() {
  return (
    <Routes>
      <Route path="/">
        {/* guest routes */}
        <Route path="unauthorized" element={<Unauthorized />}></Route>

        <Route element={<LoginPersist />}>
          {/* initial login password change component and the routes*/}
          <Route
            path="initial-password-reset"
            element={<ResetInitialPassword />}
          />
          <Route path="accept-appointment" element={<AcceptAppointment />} />
          {/*note: note final*/}
          <Route path="login" element={<Login />} />
          <Route path="/" element={<Login />} />

          <Route
            element={
              <DrawerStateProvider>
                <MainLayout />
              </DrawerStateProvider>
            }
          >
            {/* protected routes */}

            <Route element={<Authenticate allowedRoles={["qac_officer"]} />}>
              <Route path="qac_officer/">
                <Route path="" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="universities/">
                  <Route path="" element={<Universities />} />
                  <Route path="view/:id" element={<ViewUniversity />} />
                </Route>
                <Route path="createAccounts/" element={<CreateAccounts />} />
                <Route path="PGPRApplications" element={<PostGraduateProgramReviewApplications />} />
                <Route path='reviewers/'>
                  <Route path='' element={<Reviewers />} />
                  <Route path='import' element={<ImportReviewers />} />
                </Route>
                <Route path='PGPRs/'>
                  <Route path='' element={<PostGraduateProgramReviews />} />
                  <Route path='view/:id' element={<ViewPGPR />} />
                </Route>
              </Route>
            </Route>

            <Route element={<Authenticate allowedRoles={["cqa_director"]} />}>
              <Route path="cqa_director/">
                <Route path="" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="PGPRApplications" element={<PostGraduateProgramReviewApplications />} />
                <Route path="AddPGProgramPage" element={<AddPGProgramPage />} />
                <Route path="AddAccounts" element={<AddAccounts />} />
                <Route path="EditPGProgram" element={<EditPGProgram />} />
                <Route path="ViewPGPrograms/">
                  <Route path="" element={<ViewPGPrograms />} />
                  <Route
                    path="PGPrograms/:id"
                    element={<PGPrograms />}
                  />
                </Route>

                <Route path="ViewCoordinators/">
                  <Route path="" element={<ViewCoordinators />} />
                  <Route
                    path="CoordinatorProfile/:id"
                    element={<CoordinatorProfile />}
                  />

                </Route>
                <Route path="faculties/">
                  <Route path="" element={<Faculties />} />
                  <Route path="Add" element={<AddFaculty />} />
                  <Route path=":facultyId" element={<ViewFaculty />} />
                </Route>

              </Route>
            </Route>

            <Route element={<Authenticate allowedRoles={["qac_director"]} />}>
              <Route path="qac_director/">
                <Route path="" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="universities/">
                  <Route path="" element={<ViewUniversities />} />
                  <Route path="view/:id" element={<ViewUniversity />} />
                  <Route path="edit/:id" element={<EditUniversity />} />
                  <Route path="add" element={<AddUniversity />} />
                </Route>
                <Route path="cqa_offices" element={<CqaOffices />} />
                <Route path="reviewers" element={<ViewReviewers />} />
              </Route>
            </Route>

            <Route element={<ReviewerRoleProvider><Authenticate allowedRoles={["reviewer"]} /></ReviewerRoleProvider>}>
              <Route path="reviewer/">
                <Route path="" element={<ReviewerDashboard />} />
                <Route path="dashboard" element={<ReviewerDashboard />} />
                <Route path="PG_Assignments/">
                  <Route path="" element={<PGAssignments />} />
                  <Route path="ViewSer/:pgprId" element={<ViewSer />} />
                  <Route path="Conduct_DE/">
                    <Route path=":pgprId" element={<ConductDE />} />
                    <Route path=":pgprId/:criteriaId" element={<EvaluateDE />} />
                    <Route path="UpdateABC/:pgprId" element={<UpdateABC />} />
                    <Route
                      path="Standardwise_details/:pgprId"
                      element={<Standardwise_details />}
                    />
                    <Route
                      path="Summary_details/:pgprId"
                      element={<Summary_details />}
                    />
                    <Route
                      path="Submit_DE/:pgprId"
                      element={< SubmitDE />}
                    />
                    <Route
                      path="Finalize_DE/:pgprId"
                      element={< FinalizeDE />}
                    />
                    <Route
                      path="view_DE_progress/:pgprId/:reviewerId"
                      element={< DEProgress />}
                    />
                    <Route
                      path="End_DE/:pgprId"
                      element={< EndDE />}
                    />
                  </Route>
                  <Route path="Conduct_PE/">
                    <Route path=":pgprId" element={<ConductPE />} />
                    <Route
                      path="Assigned_criteria/:pgprId"
                      element={<ViewAssignedCriteria />}
                    />
                    <Route
                      path=":pgprId/:criteriaId"
                      element={<EvaluatePE />}
                    />
                    <Route
                      path="Summary_details/:pgprId"
                      element={<PESummaryDetails />}
                    />
                    <Route
                      path="Standardwise_details/:pgprId"
                      element={<PEStandardwiseDetails />}
                    />
                    <Route
                      path="Submit_PE/:pgprId"
                      element={< SubmitPE />}
                    />
                    <Route
                      path="Finalize_PE/:pgprId"
                      element={< FinalizePE />}
                    />
                    <Route
                      path="view_PE_progress/:pgprId/:reviewerId"
                      element={< PEProgress />}
                    />
                    <Route
                      path="End_PE/:pgprId"
                      element={< EndPE />}
                    />
                  </Route>
                </Route>
                <Route path="SetDate" element={<SetDate />} />
                <Route path="SetCriteria" element={<SetCriteria />} />
              </Route>
            </Route>

            {/* programme_coordinator routes */}
            <Route
              element={
                <Authenticate allowedRoles={["programme_coordinator"]} />
              }
            >
              <Route path="programme_coordinator/">
                <Route path="" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pgprs/:pgprId/ser/:serId" element={<SelfEvaluationReport />} />
                <Route path="pgprs/:pgprId/ser/:serId/submitSER" element={<SubmitPGPR />} />
                <Route path="addevidence" element={<AddEvidence />} />
                <Route path="pgprs/" element={<PGPRs />} />
                <Route path="pgprs/:pgprId/ser/:serId/EditSer/:criteriaId" element={<EditingSelfEvaluationReport />} />
              </Route>
            </Route>

            {/* dean routes */}
            <Route element={<Authenticate allowedRoles={["dean"]} />}>
              <Route path="dean/">
                <Route path="" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="SubmitConsent" element={<SubmitConsent />} />
                <Route path="pgprApplication" element={<PGPRApplication />} />
                <Route path="pgprApplications">
                  <Route path="" element={<PGPRApplications />} />
                  <Route path="create" element={<PGPRApplication />} />
                  <Route
                    path="edit/:pgprApplicationID"
                    element={<EditPGPRApplication />}
                  />
                </Route>
              </Route>
            </Route>

            <Route element={<Authenticate allowedRoles={["vice_chancellor"]} />}>
              <Route path="vice_chancellor/">
                <Route path="" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="selfevaluationreport" element={<SelfEvaluationReport />} />
                <Route path="view" element={<View />} />
                <Route path="pgprogrammes" element={<ViewPGProgrammesInUniversities />} />
                <Route path="pgprs/" element={<PGPRs />} />
                <Route path="pgprs/:pgprId/ser/:serId" element={<SelfEvaluationReport />} />
              </Route>
            </Route>

            {/* iqau routes */}
            <Route element={<Authenticate allowedRoles={["iqau_director"]} />}>
              <Route path="iqau_director/">
                <Route path="" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="pgPrograms" element={<ViewPGPs />} />
                <Route path="ser" element={<IQAUSer />} />
                <Route path="editSer" element={<IQAUEditSer />} />
                <Route path="pgProgramDetails" element={<IQAUProgramDetails />} />
              </Route>
            </Route>

            <Route
              element={
                <Authenticate allowedRoles={["programme_coordinator"]} />
              }
            >
              <Route path="programme_coordinator/">
                <Route path="" element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
              </Route>
            </Route>

          </Route>
        </Route>
        {/* 404 page & UnAuth ... */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
