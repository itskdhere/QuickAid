import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function Settings() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      await axios
        .get("/api/v1/auth/user/whoami", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            const user = res?.data?.data?.user;
            console.log(user);
            setProfileImage(user?.pfp);
            setName(user?.name);
            setEmail(user?.email);
            setPhone(user?.phone);
            setAddress(user?.address);
            setGender(user?.gender);

            if (user?.dob) {
              const date = new Date(user.dob);
              const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
              setDob(formattedDate);
            }
          }
        })
        .catch((error) => {
          toast.error(
            `Error ${error.response.data.error.code}: ${error.response.data.error.message}`
          );

          navigate("/auth/user/signin");
        });
    }
    fetchUser();
  }, []);

  return (
    <div className="dark min-h-screen space-y-10 bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <NavBar backBtn />
      <div className="mx-auto space-y-6 relative p-4 border border-gray-700 rounded text-gray-300">
        {/* Header */}
        <p className="text-2xl text-center mb-6">Settings</p>
        {/* Profile Section */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-500">👤</span>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-gray-800"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (123) 456-7890"
                className="bg-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="bg-gray-800"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your address"
                className="bg-gray-800"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Gender</Label>
              <RadioGroup
                value={gender}
                defaultValue={gender}
                onValueChange={setGender}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button variant="default" className="w-full mt-8">
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
