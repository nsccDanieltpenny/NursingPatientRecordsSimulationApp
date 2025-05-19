import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx';
import { UserProvider } from './context/UserContext.jsx';

const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <UserProvider>
        <App />
      </UserProvider>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)