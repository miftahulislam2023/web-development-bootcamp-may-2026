import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import { LanguageProvider } from './contexts/LanguageContext';
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </HelmetProvider>
);
