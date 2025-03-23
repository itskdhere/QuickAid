import { useState } from "react";
import { useNavigate } from "react-router";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function OnboardUser() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleOnboard(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    axios
      .post("/api/v1/onboard/user", { name, phone, address, dob, gender })
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">User Onboarding</CardTitle>
            <CardDescription>
              Please fill in the form to complete your onboarding process as a
              user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOnboard}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Your Phone Number"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Your Address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Gender</Label>
                  <RadioGroup
                    id="gender"
                    className="flex flex-row space-x-5"
                    required
                    value={gender}
                    onValueChange={(value) => setGender(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="gender-male" />
                      <Label htmlFor="gender-male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="gender-female" />
                      <Label htmlFor="gender-female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="gender-other" />
                      <Label htmlFor="gender-other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button
                  type="submit"
                  className="mt-6 w-full"
                  disabled={loading}
                >
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
