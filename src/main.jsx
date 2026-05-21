
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom";
import { router } from './router/router';
import { ThemeProvider } from './context/ThemeContext';
import { ExpenseProvider } from './context/ExpenseContext';
import AuthProvider from './context/AuthProvider';
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <HelmetProvider>
     <ThemeProvider> 
   <AuthProvider>
      <ExpenseProvider>
         <RouterProvider router={router} />
     </ExpenseProvider>
   </AuthProvider>   
   </ThemeProvider>
  </HelmetProvider>
  </StrictMode>,
)