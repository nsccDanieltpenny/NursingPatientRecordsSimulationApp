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
        path: "/api/adl/:id",
        element: <PatientADL />
      },
      {
        path: "/api/behaviour/:id",
        element: <PatientBehaviour />
      },
      {
        path: "/api/cognitive/:id",
        element: <PatientCognitive />
      },
      {
        path: "/api/elimination/:id",
        element: <PatientElimination />
      },
      {
        path: "/api/mobility/:id",
        element: <PatientMobility />
      },
      {
        path: "/api/nutrition/:id",
        element: <PatientNutrition />

      },
      {
        path: "/api/progressnote/:id",
        element: <PatientProgressNote />
      },
      {
        path: "/api/record/:id",
        element: <PatientRecord />
      },
      {
        path: "/api/safety/:id",
        element: <PatientSafety />
      },
      {
        path: "/api/skinsensoryaid/:id",
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
