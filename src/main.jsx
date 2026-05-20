import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router/dom";
import { router } from './router/router';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <ThemeProvider>
     <AuthProvider>
     <ExpenseProvider>
         <RouterProvider router={router} />
     </ExpenseProvider>
     </AuthProvider>
   </ThemeProvider>
  </StrictMode>,
)