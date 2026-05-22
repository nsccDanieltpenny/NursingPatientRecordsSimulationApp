import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import RequireAuth from "./routes/RequireAuth.jsx";
import Spinner from "./components/Spinner";

const Layout = lazy(() => import("./routes/Layout.jsx"));

// Lazy load route imports
const AttendanceDashboard = lazy(
  () => import("./routes/AttendanceDashboard.jsx"),
);
const Login = lazy(() => import("./routes/Login"));
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
const Unauthorized = lazy(() => import("./routes/Unauthorized.jsx"));
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
const InstructorStudents = lazy(
  () => import("./routes/InstructorStudents.jsx"),
);
const AssessmentCalendarViewer = lazy(
  () => import("./routes/InstructorAssessmentCalendar.jsx"),
);
const AttendanceCheckin = lazy(() => import("./routes/AttendanceCheckin.jsx"));
const AttendanceFailed = lazy(() => import("./routes/AttendanceFailed.jsx"));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="enroll" element={<ClassCodeEnrollment />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="attendance/checkin" element={<AttendanceCheckin />} />
        <Route path="attendance/failed" element={<AttendanceFailed />} />
        <Route path="attendance" element={<AttendanceDashboard />} />

        {/* Base app layout */}
        <Route path="/" element={<Layout />}>
          {/* protected routes */}
          <Route
            element={
              <RequireAuth allowedRoles={["Nurse", "Admin", "Instructor"]} />
            }
          >
            <Route path="nurse" element={<NurseProfile />} />
            <Route path="/" element={<Patients />} />
            <Route path="intake" element={<CreatePatient />} />
            <Route path="patients/:id" element={<PatientProfile />} />
            <Route path="patients/:id/adl" element={<PatientADL />} />
            <Route
              path="patients/:id/behaviour"
              element={<PatientBehaviour />}
            />
            <Route
              path="patients/:id/cognitive"
              element={<PatientCognitive />}
            />
            <Route
              path="patients/:id/consultcurrentillness"
              element={<PatientConsultCurrentIllness />}
            />
            <Route
              path="patients/:id/dischargechecklist"
              element={<PatientDischargeChecklist />}
            />
            <Route
              path="patients/:id/elimination"
              element={<PatientElimination />}
            />
            <Route
              path="patients/:id/labsdiagnosticsblood"
              element={<PatientLabsDiagnosticsBlood />}
            />
            <Route
              path="patients/:id/mobilityandsafety"
              element={<PatientMobilityAndSafety />}
            />
            <Route path="patients/:id/news2" element={<PatientNEWS2 />} />
            <Route
              path="patients/:id/nutrition"
              element={<PatientNutrition />}
            />
            <Route
              path="patients/:id/progressnote"
              element={<PatientProgressNote />}
            />
            <Route
              path="patients/:id/acuteprogress"
              element={<PatientAcuteProgress />}
            />
            <Route
              path="patients/:id/skinandsenoryaid"
              element={<PatientSkinSensoryAid />}
            />

            <Route
              element={<RequireAuth allowedRoles={["Instructor", "Admin"]} />}
            >
              <Route path="admin" element={<AdminProfile />} />
              <Route path="admin/class/:id" element={<ClassProfile />} />
              <Route path="admin/class/create" element={<CreateClass />} />
              <Route path="admin/class/edit/:id" element={<EditClass />} />
              <Route path="admin/campus/:id" element={<CampusProfile />} />
              <Route path="admin/campus/create" element={<CreateCampus />} />
              <Route path="admin/campus/:id/edit" element={<EditCampus />} />
              <Route path="admin/campuses" element={<CampusList />} />

              <Route
                path="instructor/classes"
                element={<InstructorClasses />}
              />
              <Route
                path="instructor/students"
                element={<InstructorStudents />}
              />
              <Route
                path="instructor/calendar"
                element={<AssessmentCalendarViewer />}
              />
            </Route>

            <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
              {/* Admin only */}
              <Route path="instructors" element={<InstructorProfile />} />
            </Route>
          </Route>

          {/* catch all (page not found) */}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
