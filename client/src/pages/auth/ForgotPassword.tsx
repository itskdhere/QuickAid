import { useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import Logo from "@/components/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    axios
      .post("/api/v1/auth/forgot-password", { email })
      .then(() => {
        setSuccess(true);
      })
      .catch((err) => {
        toast.error(`Error ${err?.status}: ${err?.message}`);
        setSending(false);
        setSuccess(false);
      });
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
        <div className="flex flex-col gap-6">
          {success ? (
            <Card className="bg-transparent">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">
                  Password Reset Link Sent Successfully
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center">
                  If an account with the provided email exists, a password reset
                  link has been sent. Please check your email.
                </p>
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
          ) : (
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
                    <Button type="submit" className="w-full" disabled={sending}>
                      {sending ? "Sending..." : "Send Reset Link"}
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
          )}
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            By signin in, you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
