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
        path: "/patient/:id",
        element: <PatientProfile />
        },
      {
        path:"/patient/:id/elimination",
        element: <PatientElimination />
        },
      { 
        path: "/patient/:id/nutrition",
        element: <PatientNutrition />

        },
        {
            path: "/patient/:id/mobility",
            element: <PatientMobility />

        },

    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
