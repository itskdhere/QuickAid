import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/v1/auth/forgot-password", { email })
      .then(() => {
        toast.success("Password reset link sent to your email.");
        navigate("/auth/user/signin");
      })
      .catch((err) => {
        toast.error(`Error ${err?.status}: ${err?.message}`);
        setLoading(false);
      });
  }

  return (
    <div className="dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 text-primary bg-gradient-to-b from-gray-900 to-black">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card className="bg-transparent">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Forgot Password</CardTitle>
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
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </div>
            </form>
            <div className="text-center text-sm mt-6">
              Remembered your password?{" "}
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
