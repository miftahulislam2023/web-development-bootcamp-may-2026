import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'react-hot-toast';



import { RouterProvider } from "react-router/dom";
import { router } from './router/routes.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    
  <RouterProvider router={router}></RouterProvider>
    <Toaster />
  </StrictMode>,
)
