import { Route, Routes } from "react-router-dom";

import HomePage from "./routes/home";
import DiagnosticPage from "./routes/diagnostic";
import AppointmentsPage from "./routes/appointments";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diagnostic" element={<DiagnosticPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
        </Routes>
    );
}