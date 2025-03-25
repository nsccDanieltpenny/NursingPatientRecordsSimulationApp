import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import Patients from './routes/Patients.jsx'
import PatientElimination from './routes/PatientElimination.jsx'
import PatientProfile from './routes/PatientProfile.jsx'
import Login from './routes/Login.jsx'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router-dom'
import PatientNutrition from './routes/PatientNutrition.jsx';
import PatientMobility from './routes/PatientMobility.jsx';
import Registration from './routes/Register.jsx';
import Logout from './routes/Logout.jsx';
import PatientCognitive from './routes/PatientCognitive.jsx';

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
      {
        path: "/api/patients/:id",
        element: <PatientProfile />
      },
      {
        path: "/api/eliminations/:id",
        element: <PatientElimination />
      },
      {
        path: "/api/nutritions/:id",
        element: <PatientNutrition />

      },
      {
        path: "/api/mobilities/:id",
        element: <PatientMobility />

        },
        {
            path: "/api/cognitives/:id",
            element: <PatientCognitive />
        }

    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
