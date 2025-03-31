import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import Patients from './routes/Patients.jsx'
import PatientADL from './routes/PatientADL.jsx';
import PatientCognitive from './routes/PatientCognitive.jsx';
import PatientProgressNote from './routes/PatientProgressNote.jsx';
import PatientRecord from './routes/PatientRecord.jsx';
import PatientSafety from './routes/PatientSafety.jsx';
import PatientSkinSensoryAid from './routes/PatientSkinSensoryAid.jsx';
import PatientElimination from './routes/PatientElimination.jsx'
import Login from './routes/Login.jsx'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router-dom'
import PatientNutrition from './routes/PatientNutrition.jsx';
import PatientMobility from './routes/PatientMobility.jsx';
import Registration from './routes/Register.jsx';
import Logout from './routes/Logout.jsx';
import PatientBehaviour from './routes/PatientBehaviour.jsx';
import PatientProfile from './routes/PatientProfile.jsx';
import { assessmentRoutes } from './utils/routeConfig.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Patients />,
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/logout",
        element: <Logout />
      },
      {
        path: "/register",
        element: <Registration />
      },
      ////////////////////////////
      //       PATIENT INFO     //
      ////////////////////////////
      {
        path: "/api/patients/:id",
        element: <PatientProfile />
      },
      {
        path: assessmentRoutes.ADL,
        element: <PatientADL />
      },
      {
        path: assessmentRoutes.Behaviour,
        element: <PatientBehaviour />
      },
      {
        path: assessmentRoutes.Cognitive,
        element: <PatientCognitive />
      },
      {
        path: assessmentRoutes.Elimination,
        element: <PatientElimination />
      },
      {
        path: assessmentRoutes.Mobility,
        element: <PatientMobility />
      },
      {
        path: assessmentRoutes.Nutrition,
        element: <PatientNutrition />
      },
      {
        path: assessmentRoutes.ProgressNote,
        element: <PatientProgressNote />
      },
      {
        path: assessmentRoutes.Record,
        element: <PatientRecord />
      },
      {
        path: assessmentRoutes.Safety,
        element: <PatientSafety />
      },
      {
        path: assessmentRoutes.SkinSensoryAid,
        element: <PatientSkinSensoryAid />
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)