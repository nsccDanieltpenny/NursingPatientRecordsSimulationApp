import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Spinner from "./components/Spinner";
import RequireAuthentication from "./routes/RequireAuthentication.jsx";
import RequireRole from "./routes/RequireRole.jsx";

const Layout = lazy(() => import("./routes/Layout.jsx"));

// Lazy load route imports
const AttendanceDashboard = lazy(
  () => import("./routes/AttendanceDashboard.jsx"),
);
const CreatePatient = lazy(() => import("./routes/CreatePatient.jsx"));
const Logout = lazy(() => import("./routes/Logout"));
const AdminProfile = lazy(() => import("./routes/AdminProfile"));
const ClassProfile = lazy(() => import("./routes/ClassProfile"));
const CreateClass = lazy(() => import("./routes/CreateClass"));
const EditClass = lazy(() => import("./routes/EditClass"));
const Patients = lazy(() => import("./routes/Patients.jsx"));
const PatientProfile = lazy(() => import("./routes/PatientProfile"));
const NurseProfile = lazy(() => import("./routes/NurseProfile.jsx"));
const PatientADL = lazy(() => import("./routes/PatientADL"));
const PatientBehaviour = lazy(() => import("./routes/PatientBehaviour"));
const PatientCognitive = lazy(() => import("./routes/PatientCognitive"));
const PatientDischargeChecklist = lazy(
  () => import("./routes/PatientDischargeChecklist.jsx"),
);
const PatientElimination = lazy(() => import("./routes/PatientElimination"));
const PatientLabsDiagnosticsBlood = lazy(
  () => import("./routes/PatientLabsDiagnosticsBlood"),
);
const PatientMobilityAndSafety = lazy(
  () => import("./routes/PatientMobilityAndSafety"),
);
const PatientNEWS2 = lazy(() => import("./routes/PatientNEWS2"));
const PatientProgressNote = lazy(() => import("./routes/PatientProgressNote"));
const PatientAcuteProgress = lazy(
  () => import("./routes/PatientAcuteProgress"),
);
const PatientSkinSensoryAid = lazy(
  () => import("./routes/PatientSkinSensoryAid"),
);
const PatientNutrition = lazy(() => import("./routes/PatientNutrition"));
const PageNotFound = lazy(() => import("./routes/PageNotFound.jsx"));
const InstructorProfile = lazy(() => import("./routes/InstructorProfile.jsx"));
const ClassCodeEnrollment = lazy(
  () => import("./routes/ClassCodeEnrollment.jsx"),
);
const CampusProfile = lazy(() => import("./routes/CampusProfile.jsx"));
const PatientConsultCurrentIllness = lazy(
  () => import("./routes/PatientConsultCurrentIllness.jsx"),
);
const CreateCampus = lazy(() => import("./routes/CreateCampus.jsx"));
const CampusList = lazy(() => import("./routes/CampusList.jsx"));
const EditCampus = lazy(() => import("./routes/EditCampus.jsx"));
const InstructorClasses = lazy(() => import("./routes/InstructorClasses.jsx"));
const AssessmentCalendarViewer = lazy(
  () => import("./routes/InstructorAssessmentCalendar.jsx"),
);
const AttendanceCheckin = lazy(() => import("./routes/AttendanceCheckin.jsx"));
const AttendanceFailed = lazy(() => import("./routes/AttendanceFailed.jsx"));
const UserManagement = lazy(() => import("./routes/UserManagement.jsx"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* public routes */}
        <Route path="logout" element={<Logout />} />
        <Route path="enroll" element={<ClassCodeEnrollment />} />
        <Route path="attendance/checkin" element={<AttendanceCheckin />} />
        <Route path="attendance/failed" element={<AttendanceFailed />} />
        

        {/* Protected routes */}
        <Route element={<RequireAuthentication />}>
          {/* Base layout */}
          <Route element={<Layout />}>
            {/* All roles */}
            <Route
              element={<RequireRole roles={["Nurse", "Instructor", "Admin"]} />}
            >
              <Route path="attendance" element={<AttendanceDashboard />} />
              <Route path="" element={<Navigate to="/patients" replace />} />
              <Route path="nurse" element={<NurseProfile />} />
              <Route path="intake" element={<CreatePatient />} />
              <Route path="patients">
                <Route path="" element={<Patients />} />
                <Route path=":id" element={<PatientProfile />} />
                <Route path=":id/adl" element={<PatientADL />} />
                <Route path=":id/behaviour" element={<PatientBehaviour />} />
                <Route path=":id/cognitive" element={<PatientCognitive />} />
                <Route
                  path=":id/consultcurrentillness"
                  element={<PatientConsultCurrentIllness />}
                />
                <Route
                  path=":id/dischargechecklist"
                  element={<PatientDischargeChecklist />}
                />
                <Route
                  path=":id/elimination"
                  element={<PatientElimination />}
                />
                <Route
                  path=":id/labsdiagnosticsblood"
                  element={<PatientLabsDiagnosticsBlood />}
                />
                <Route
                  path=":id/mobilityandsafety"
                  element={<PatientMobilityAndSafety />}
                />
                <Route path=":id/news2" element={<PatientNEWS2 />} />
                <Route path=":id/nutrition" element={<PatientNutrition />} />
                <Route
                  path=":id/progressnote"
                  element={<PatientProgressNote />}
                />
                <Route
                  path=":id/acuteprogress"
                  element={<PatientAcuteProgress />}
                />
                <Route
                  path=":id/skinandsenoryaid"
                  element={<PatientSkinSensoryAid />}
                />
              </Route>
            </Route>

            {/* Instructor roles */}
            <Route
              path="instructor"
              element={<RequireRole roles={["Instructor", "Admin"]} />}
            >
              <Route path="classes" element={<InstructorClasses />} />
              <Route path="calendar" element={<AssessmentCalendarViewer />} />
              <Route path="users" element={<UserManagement />} />
            </Route>

            {/* Admin roles */}
            <Route path="admin" element={<RequireRole roles={["Admin"]} />}>
              <Route path="" element={<AdminProfile />} />
              <Route path="class/:id" element={<ClassProfile />} />
              <Route path="class/create" element={<CreateClass />} />
              <Route path="class/edit/:id" element={<EditClass />} />
              <Route path="campus/:id" element={<CampusProfile />} />
              <Route path="campus/create" element={<CreateCampus />} />
              <Route path="campus/:id/edit" element={<EditCampus />} />
              <Route path="campuses" element={<CampusList />} />
              <Route path="instructors" element={<InstructorProfile />} />
              <Route path="users" element={<UserManagement />} />
            </Route>
            {/* End Base layout */}
          </Route>
          {/* End Protected routes */}
        </Route>

        {/* catch all (page not found) */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
