import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";
import Logo from "@/components/Logo";
import { toast } from "sonner";

export default function VerifyEmailSent() {
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/auth/user/signup");
    }
  }, [email, navigate]);

  async function handleResend() {
    setLoading(true);

    try {
      const response = await axios.post("/api/v1/auth/resend-verification", {
        email,
      });

      if (response.status === 200) {
        setResent(true);
        toast.success("Verification email sent successfully!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message ||
        "Failed to send verification email";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (!email) {
    return null;
  }

  return (
    <div className="dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 text-primary bg-gradient-to-b from-gray-900 to-black">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium text-primary"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md text-primary-foreground">
            <Logo />
          </div>
          QuickAid
        </Link>
        <Card className="bg-transparent">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-blue-500" />
            </div>
            <CardTitle className="text-xl">Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              We've sent a verification email to <strong>{email}</strong>.
              Please check your inbox and click the verification link to
              activate your account.
            </p>

            {resent && (
              <div className="flex items-center justify-center gap-2 text-green-500 mb-4">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Verification email resent!</span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                onClick={handleResend}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Sending..." : "Resend Verification Email"}
              </Button>

              <Link to="/auth/user/signin" state={{ email }}>
                <Button variant="default" className="w-full">
                  Go to Sign In
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Didn't receive the email? Check your spam folder or try resending.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
