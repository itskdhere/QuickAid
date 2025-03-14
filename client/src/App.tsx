import { Routes, Route, Navigate } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import Landing from "./pages/Landing";
import AuthIndex from "./pages/auth/Index";
import AuthUserSignup from "./pages/auth/user/Signup";
import AuthUserSignin from "./pages/auth/user/Signin";
import OnboardUser from "./pages/onboard/User";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="auth">
          <Route index element={<AuthIndex />} />
          <Route path="user">
            <Route index element={<Navigate to="signup" />} />
            <Route path="signup" element={<AuthUserSignup />} />
            <Route path="signin" element={<AuthUserSignin />} />
          </Route>
        </Route>
        <Route path="onboard">
          <Route path="user" element={<OnboardUser />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
