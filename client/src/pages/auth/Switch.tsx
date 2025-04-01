import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

export default function AuthSwitch() {
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gradient-to-b from-gray-900 to-black">
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
            <CardTitle className="text-xl">Continue as...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <Link to="/auth/user/signup">
                <Button variant="default" className="w-full">
                  User
                </Button>
              </Link>
              <Link to="#" className="cursor-not-allowed">
                <Button variant="secondary" className="w-full" disabled>
                  Organization
                </Button>
              </Link>
              <Link to="/auth/forgot-password">
                <Button variant="link" className="w-full underline">
                  Reset Password
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
