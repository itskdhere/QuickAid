import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import Landing from "./pages/Landing";
import AuthSwitch from "./pages/auth/Switch";
import AuthUserSignup from "./pages/auth/user/Signup";
import AuthUserSignin from "./pages/auth/user/Signin";
import AuthForgotPassword from "./pages/auth/user/ForgotPassword";
import OnboardUser from "./pages/onboard/User";
import UserSettings from "./pages/user/Settings";
import UserDashboard from "./pages/user/Dashboard";
import UserDiagnostics from "./pages/user/Diagnostics";
import UserNearby from "./pages/user/Nearby";
import UserAmbulance from "./pages/user/Ambulance";
import UserCommunity from "./pages/user/Community";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    if (typeof navigator.serviceWorker !== "undefined") {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return (
    <>
      <Toaster className="dark" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="auth">
          <Route index element={<Navigate to="switch" />} />
          <Route path="switch" element={<AuthSwitch />} />
          <Route path="forgot-password" element={<AuthForgotPassword />} />
          <Route path="user">
            <Route index element={<Navigate to="signup" />} />
            <Route path="signup" element={<AuthUserSignup />} />
            <Route path="signin" element={<AuthUserSignin />} />
          </Route>
        </Route>
        <Route path="onboard">
          <Route path="user" element={<OnboardUser />} />
        </Route>
        <Route path="user">
          <Route path="settings" element={<UserSettings />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="diagnostics" element={<UserDiagnostics />} />
          <Route path="nearby" element={<UserNearby />} />
          <Route path="ambulance" element={<UserAmbulance />} />
          <Route path="community" element={<UserCommunity />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
