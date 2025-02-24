import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx';
import Patients from './routes/Patients.jsx'
import PatientProfile from './routes/PatientProfile.jsx'
import Login from './routes/Login.jsx'
import WeatherForecast from './routes/WeatherForecast-test.jsx';
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router-dom'

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
        path: "/patients/:id",
        element: <PatientProfile />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/weather",
        element: <WeatherForecast />
      },
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
