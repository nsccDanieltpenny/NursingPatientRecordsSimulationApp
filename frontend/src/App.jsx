import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Spinner from "./components/Spinner";
import RequireAuthentication from "./routes/auth/RequireAuthentication.jsx";
import RequireRole from "./routes/roles/RequireRole.jsx";

const Layout = lazy(() => import("./routes/Layout.jsx"));

// Lazy load route imports
const AttendanceDashboard = lazy(
  () => import("./routes/roles/nurse/AttendanceDashboard.jsx"),
);
const CreatePatient = lazy(() => import("./routes/roles/nurse/CreatePatient.jsx"));
const Logout = lazy(() => import("./routes/auth/Logout"));
const AdminProfile = lazy(() => import("./routes/roles/admin/AdminProfile.jsx"));
const ClassProfile = lazy(() => import("./routes/roles/admin/ClassProfile.jsx"));
const CreateClass = lazy(() => import("./routes/roles/admin/CreateClass.jsx"));
const EditClass = lazy(() => import("./routes/roles/admin/EditClass.jsx"));
const Patients = lazy(() => import("./routes/patients/Patients.jsx"));
const PatientProfile = lazy(() => import("./routes/patients/PatientProfile.jsx"));
const NurseProfile = lazy(() => import("./routes/roles/nurse/NurseProfile.jsx"));
const PatientADL = lazy(() => import("./routes/patients/PatientADL.jsx"));
const PatientBehaviour = lazy(() => import("./routes/patients/PatientBehaviour.jsx"));
const PatientCognitive = lazy(() => import("./routes/patients/PatientCognitive.jsx"));
const PatientDischargeChecklist = lazy(
  () => import("./routes/patients/PatientDischargeChecklist.jsx"),
);
const PatientElimination = lazy(() => import("./routes/patients/PatientElimination.jsx"));
const PatientLabsDiagnosticsBlood = lazy(
  () => import("./routes/patients/PatientLabsDiagnosticsBlood.jsx"),
);
const PatientMobilityAndSafety = lazy(
  () => import("./routes/patients/PatientMobilityAndSafety.jsx"),
);
const PatientNEWS2 = lazy(() => import("./routes/patients/PatientNEWS2.jsx"));
const PatientProgressNote = lazy(() => import("./routes/patients/PatientProgressNote.jsx"));
const PatientAcuteProgress = lazy(
  () => import("./routes/patients/PatientAcuteProgress.jsx"),
);
const PatientSkinSensoryAid = lazy(
  () => import("./routes/patients/PatientSkinSensoryAid.jsx"),
);
const PatientNutrition = lazy(() => import("./routes/patients/PatientNutrition.jsx"));
const PageNotFound = lazy(() => import("./routes/PageNotFound.jsx"));
const InstructorProfile = lazy(() => import("./routes/roles/instructor/InstructorProfile.jsx"));
const ClassCodeEnrollment = lazy(
  () => import("./routes/ClassCodeEnrollment.jsx"),
);
const CampusProfile = lazy(() => import("./routes/roles/admin/CampusProfile.jsx"));
const PatientConsultCurrentIllness = lazy(
  () => import("./routes/patients/PatientConsultCurrentIllness.jsx"),
);
const CreateCampus = lazy(() => import("./routes/roles/admin/CreateCampus.jsx"));
const CampusList = lazy(() => import("./routes/roles/admin/CampusList.jsx"));
const EditCampus = lazy(() => import("./routes/roles/admin/EditCampus.jsx"));
const InstructorClasses = lazy(() => import("./routes/roles/instructor/InstructorClasses.jsx"));
const AssessmentCalendarViewer = lazy(
  () => import("./routes/roles/instructor/InstructorAssessmentCalendar.jsx"),
);
const AttendanceCheckin = lazy(() => import("./routes/AttendanceCheckin.jsx"));
const AttendanceFailed = lazy(() => import("./routes/AttendanceFailed.jsx"));
const UserManagement = lazy(() => import("./routes/roles/admin/UserManagement.jsx"));

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
              <Route path="nurse" element={<NurseProfile />} />
              <Route path="intake" element={<CreatePatient />} />
              <Route path="" element={<Navigate to="/patients" replace />} />
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
