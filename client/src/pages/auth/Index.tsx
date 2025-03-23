import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AuthIndex() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
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
              <Link to="/auth/org/signup">
                <Button variant="secondary" className="w-full">
                  Organization
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
