import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router";
import { UserProvider } from "./contexts/UserContext";
import { LoginPage } from "./components/LoginPage";
import { MainDashboard } from "./components/MainDashboard";
import { GuestDashboard } from "./components/GuestDashboard";
import { DeviceListPage } from "./components/DeviceListPage";
import { ApprovalList } from "./components/ApprovalList";
import { CalibrationDetails } from "./components/CalibrationDetails";
import { AddDeviceForm } from "./components/AddDeviceForm";
import { UpdateDeviceForm } from "./components/UpdateDeviceForm";
import { ViewDeviceDetails } from "./components/ViewDeviceDetails";
import { ViewProcedure } from "./components/ViewProcedure";
import { CalibrationEntry } from "./components/CalibrationEntry";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={<MainDashboard />}
          />
          <Route
            path="/guest-dashboard"
            element={<GuestDashboard />}
          />
          <Route
            path="/device-list"
            element={<DeviceListPage />}
          />
          <Route
            path="/approval-list"
            element={<ApprovalList />}
          />
          <Route
            path="/calibration-details"
            element={<CalibrationDetails />}
          />
          <Route
            path="/add-device"
            element={<AddDeviceForm />}
          />
          <Route
            path="/update-device"
            element={<UpdateDeviceForm />}
          />
          <Route
            path="/view-device"
            element={<ViewDeviceDetails />}
          />
          <Route
            path="/view-procedure"
            element={<ViewProcedure />}
          />
          <Route
            path="/calibration-entry"
            element={<CalibrationEntry />}
          />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}