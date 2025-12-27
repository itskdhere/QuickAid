import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(true);
  const location = useLocation();

  // Pre-fill email if passed from signin page
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/v1/auth/resend-verification", {
        email,
      });

      if (response.status === 200) {
        setSent(true);
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

  if (sent) {
    return (
      <div className="dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 text-primary bg-gradient-to-b from-gray-900 to-black">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Card className="bg-transparent">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-xl">Email Sent!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                We've sent a verification email to <strong>{email}</strong>.
                Please check your inbox and click the verification link.
              </p>

              <div className="flex flex-col gap-3">
                <Link to="/auth/user/signin">
                  <Button className="w-full">Back to Sign In</Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => setSent(false)}
                  className="w-full"
                >
                  Send to Different Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 text-primary bg-gradient-to-b from-gray-900 to-black">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className="bg-transparent">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Resend Verification Email</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Verification Email"}
                </Button>
              </div>
            </form>

            <div className="text-center text-sm mt-6">
              Already verified?{" "}
              <Link
                to="/auth/user/signin"
                className="underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
