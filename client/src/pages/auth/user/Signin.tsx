import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function AuthUserSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignin = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    window.location.href = "/api/v1/auth/google";
  };

  function handleSignin(
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/v1/auth/user/signin", { email, password })
      .then(() => {
        setLoading(false);
        navigate("/user/dashboard");
      })
      .catch((err) => {
        toast.error(
          `Error ${err.response.data.error.code}: ${err.response.data.error.message}`
        );
        setLoading(false);
      });
  }

  useEffect(() => {
    async function fetchUser() {
      await axios
        .get("/api/v1/auth/user/whoami", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            navigate("/user/dashboard");
          }
        })
        .catch((error) => {
          if (error.response.data.error.code === 401) return;
          toast.error(
            `Error ${error.response.data.error.code}: ${error.response.data.error.message}`
          );
        });
    }
    fetchUser();
  }, []);

  return (
    <div className="dark flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gradient-to-b from-gray-900 to-black">
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
          <Card className="bg-transparent">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Sign-in with your Google account or Email Password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignin}>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <Button
                      variant="secondary"
                      className="w-full"
                      disabled={loading}
                      onClick={handleGoogleSignin}
                    >
                      <FcGoogle className="h-24 w-24" />
                      Continue with Google
                    </Button>
                  </div>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
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
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          to="/auth/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      onClick={handleSignin}
                      disabled={loading}
                    >
                      Log In
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/auth/user/signup"
                      className="underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By signin in, you agree to our <a href="#">Terms of Service</a> and{" "}
            <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
