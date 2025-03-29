import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthIndex() {
  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gradient-to-b from-gray-900 to-black">
      <div className="flex w-full max-w-sm flex-col gap-6">
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
