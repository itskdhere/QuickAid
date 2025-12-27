import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    verifyEmail(token);
  }, [token]);

  async function verifyEmail(verificationToken: string) {
    try {
      const response = await axios.post("/api/v1/auth/verify-email", {
        token: verificationToken,
      });

      if (response.status === 200) {
        setStatus("success");
        setMessage(response.data.message);
        toast.success("Email verified successfully!");

        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          navigate("/auth/user/signin");
        }, 3000);
      }
    } catch (error: any) {
      setStatus("error");
      const errorMessage =
        error.response?.data?.error?.message || "Verification failed";
      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  }

  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader className="h-12 w-12 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "error":
        return <XCircle className="h-12 w-12 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (status) {
      case "loading":
        return "Verifying Email...";
      case "success":
        return "Email Verified!";
      case "error":
        return "Verification Failed";
    }
  };

  return (
    <div className="dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 text-primary bg-gradient-to-b from-gray-900 to-black">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className="bg-transparent">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">{getIcon()}</div>
            <CardTitle className="text-xl">{getTitle()}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">{message}</p>

            {status === "success" && (
              <p className="text-sm text-muted-foreground mb-4">
                Redirecting to sign in page in 3 seconds...
              </p>
            )}

            <div className="flex flex-col gap-3">
              {status === "success" && (
                <Button onClick={() => navigate("/auth/user/signin")}>
                  Go to Sign In
                </Button>
              )}

              {status === "error" && (
                <>
                  <Button
                    onClick={() => navigate("/auth/user/signin")}
                    variant="outline"
                  >
                    Back to Sign In
                  </Button>
                  <Button onClick={() => navigate("/auth/resend-verification")}>
                    Resend Verification Email
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
