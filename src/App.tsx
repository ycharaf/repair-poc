import { Route, Routes } from "react-router-dom";

import HomePage from "./routes/home";
import DiagnosticPage from "./routes/diagnostic";
import AppointmentsPage from "./routes/appointments";
import EstimationPage from "./routes/EstimationPage";
import ChooseMethodPage from "./routes/ChooseMethodPage";
import VisioPage from "./routes/VisioPage";
import StoreSelectionPage from "./routes/StoreSelectionPage";
import ConfirmationPage from "./routes/ConfirmationPage";
import QuoteInterventionPage from "./routes/QuoteInterventionPage";
import KeyDropLocationPage from "./routes/KeyDropLocationPage";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diagnostic" element={<DiagnosticPage />} />
            <Route path="/estimation" element={<EstimationPage />} />
            <Route path="/choose-method" element={<ChooseMethodPage />} />
            <Route path="/appointment/visio" element={<VisioPage />} />
            <Route path="/appointment/store" element={<StoreSelectionPage />} />
            <Route path="/quote-intervention" element={<QuoteInterventionPage />} />
            <Route path="/key-drop-location" element={<KeyDropLocationPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
        </Routes>
    );
}