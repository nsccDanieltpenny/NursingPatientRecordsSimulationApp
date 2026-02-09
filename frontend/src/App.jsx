import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Login from "./routes/Login";
import Registration from "./routes/Register";
import CreatePatient from './routes/CreatePatient.jsx';
import Logout from "./routes/Logout";
import AdminProfile from "./routes/AdminProfile";
import ClassProfile from "./routes/ClassProfile";
import CreateClass from "./routes/CreateClass";
import Patients from './routes/Patients.jsx'
import PatientProfile from "./routes/PatientProfile";
import PatientADL from "./routes/PatientADL";
import PatientBehaviour from "./routes/PatientBehaviour";
import PatientCognitive from "./routes/PatientCognitive";
import PatientDischargeChecklist from "./routes/PatientDischargeChecklist.jsx";
import PatientElimination from "./routes/PatientElimination";
import PatientLabsDiagnosticsBlood from "./routes/PatientLabsDiagnosticsBlood";
import PatientMobilityAndSafety from "./routes/PatientMobilityAndSafety";
import PatientProgressNote from "./routes/PatientProgressNote";
import PatientAcuteProgress from "./routes/PatientAcuteProgress";
import PatientSkinSensoryAid from "./routes/PatientSkinSensoryAid";
import PatientNutrition from "./routes/PatientNutrition";
import Unauthorized from "./routes/Unauthorized.jsx";
import PageNotFound from "./routes/PageNotFound.jsx";
import Layout from "./routes/Layout.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";
import InstructorProfile from "./routes/InstructorProfile.jsx";
import RegistrationInstructor from "./routes/RegistrationInstructor.jsx";
import ClassCodeEnrollment from "./routes/ClassCodeEnrollment.jsx";
import { useMsal } from "@azure/msal-react";
import PatientConsultCurrentIllness from "./routes/PatientConsultCurrentIllness.jsx";

function App() {
  const { instance } = useMsal();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle redirect promise on app load
    instance.handleRedirectPromise()
      .then((response) => {
        if (response) {
          // Successfully returned from redirect, navigate to home
          navigate('/', { replace: true });
        }
      })
      .catch((error) => {
        console.error('Error handling redirect:', error);
      });
  }, [instance, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        {/* <Route path="register" element={<Registration />} /> */}
        <Route path="enroll" element={<ClassCodeEnrollment />} />
        <Route path="logout" element={<Logout />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* protected routes */}
        <Route element={<RequireAuth allowedRoles={['Nurse', 'Admin', 'Instructor']}/>} >
          <Route path="/" element={<Patients />} />
          <Route path="intake" element={<CreatePatient />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="patients/:id/adl" element={<PatientADL />} />
          <Route path="patients/:id/behaviour" element={<PatientBehaviour />} />
          <Route path="patients/:id/cognitive" element={<PatientCognitive />} />
          <Route path="patients/:id/consultcurrentillness" element={<PatientConsultCurrentIllness />} />
          <Route path="patients/:id/dischargechecklist" element={<PatientDischargeChecklist />} />
          <Route path="patients/:id/elimination" element={<PatientElimination />} />
          <Route path ="patients/:id/labsdiagnosticsblood" element={<PatientLabsDiagnosticsBlood />} />
          <Route path="patients/:id/mobilityandsafety" element={<PatientMobilityAndSafety />} />
          <Route path="patients/:id/nutrition" element={<PatientNutrition />} />
          <Route path="patients/:id/progressnote" element={<PatientProgressNote />} />
          <Route path="patients/:id/acuteprogress" element={<PatientAcuteProgress />} />
          <Route path="patients/:id/skinandsenoryaid" element={<PatientSkinSensoryAid />} />

          <Route element={<RequireAuth allowedRoles={['Instructor', 'Admin']}/>} >
            <Route path="admin" element={<AdminProfile />} />
            <Route path="admin/class/:id" element={<ClassProfile />} />
            <Route path="admin/class/create" element={<CreateClass />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={['Admin']}/>} > 
            {/* Admin only */}
            <Route path="instructors" element={<InstructorProfile />} />
          </Route>
        </Route>

        {/* catch all (page not found) */}
        <Route path="*" element={<PageNotFound />} />

      </Route>
    </Routes>
  );
}


export default App;