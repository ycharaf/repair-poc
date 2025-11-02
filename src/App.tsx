import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/routes/HomePage';
import DevicesPage from '@/routes/DevicesPage';
import EstimationPage from '@/routes/EstimationPage';
import RepairersPage from '@/routes/RepairersPage';
import TrackingPage from '@/routes/TrackingPage';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/devices" element={<DevicesPage />} />
                <Route path="/estimation/:deviceId" element={<EstimationPage />} />
                <Route path="/repairers/:deviceId" element={<RepairersPage />} />
                <Route path="/tracking/:repairId" element={<TrackingPage />} />
            </Routes>
        </BrowserRouter>
    );
}