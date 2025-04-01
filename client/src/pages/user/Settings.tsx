import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [id, setId] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [isLoading]);

  async function fetchUser() {
    try {
      setFetchError(null);

      const response = await axios.get("/api/v1/account/user/view", {
        withCredentials: true,
      });

      if (response.status === 200 && response.data?.data?.user) {
        const user = response.data.data.user;
        setId(user.id || "");
        setProfileImage(user?.pfp || null);
        setName(user?.name || "");
        setEmail(user?.email || "");
        setPhone(user?.phone || "");
        setAddress(user?.address || "");
        setGender(user?.gender || "");
        setCreatedAt(user?.createdAt || "");
        setUpdatedAt(user?.updatedAt || "");

        if (user?.dob) {
          try {
            const date = new Date(user.dob);
            if (!isNaN(date.getTime())) {
              const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
              setDob(formattedDate);
            }
          } catch (dateError) {
            console.error("Error parsing date:", dateError);
          }
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error
          const status = error.response.status;
          const errorMessage =
            error.response.data?.error?.message || "Unknown error";

          setFetchError(`Failed to load profile (${status}): ${errorMessage}`);

          if (status === 401 || status === 403) {
            toast.error("You need to sign in to access this page");
            // Redirect after a short delay to show the toast
            setTimeout(() => navigate("/auth/user/signin"), 1500);
            return;
          }
        } else if (error.request) {
          // No response received
          setFetchError(
            "Network error. Please check your internet connection."
          );
        } else {
          setFetchError("An error occurred while fetching your profile.");
        }
      } else {
        setFetchError("An unexpected error occurred. Please try again later.");
      }
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    // Phone validation (simple check)
    if (!phone.trim() && !/^[+]?[\d\s()-]{7,20}$/.test(phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    // Date validation
    if (dob) {
      try {
        const dobDate = new Date(dob);
        const now = new Date();

        if (isNaN(dobDate.getTime())) {
          errors.dob = "Please enter a valid date";
        } else if (dobDate > now) {
          errors.dob = "Birth date cannot be in the future";
        }
      } catch (e) {
        errors.dob = "Please enter a valid date";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUserData = {
        name: name.trim(),
        phone: phone || undefined,
        address: address || undefined,
        dob: dob ? new Date(dob).toISOString() : undefined,
        gender: gender || undefined,
      };

      const response = await axios.put(
        "/api/v1/account/user/update",
        updatedUserData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        fetchUser();
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error: any) {
      console.error("Update profile error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          const errorMessage =
            error.response.data?.error?.message || "Unknown error";

          if (status === 400) {
            // Validation errors from server
            const fieldErrors = error.response.data?.error?.details;
            if (fieldErrors && typeof fieldErrors === "object") {
              const newFormErrors: Record<string, string> = {};
              Object.entries(fieldErrors).forEach(([field, message]) => {
                newFormErrors[field] = message as string;
              });
              setFormErrors(newFormErrors);
              toast.error("Please check the information you provided");
            } else {
              toast.error(errorMessage || "Invalid information provided");
            }
          } else if (status === 401 || status === 403) {
            toast.error("You need to sign in again to update your profile");
            setTimeout(() => navigate("/auth/user/signin"), 1500);
          } else if (status >= 500) {
            toast.error("Server error. Please try again later");
          } else {
            toast.error(`Failed to update profile: ${errorMessage}`);
          }
        } else if (error.request) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error("Failed to update profile. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchError) {
    return (
      <div className="dark min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
        <NavBar backBtn />
        <div className="flex flex-col justify-center items-center h-[80vh] space-y-4">
          <div className="p-6 border border-red-800 bg-red-900/20 rounded-md max-w-md w-full">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-gray-200">
                  Error Loading Profile
                </h3>
                <p className="text-gray-400">{fetchError}</p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete("/api/v1/account/user/delete", {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Your account has been deleted successfully");
        // Redirect to home page after a short delay
        setTimeout(() => navigate("/"), 1500);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error: any) {
      console.error("Delete account error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          const errorMessage =
            error.response.data?.error?.message || "Unknown error";

          if (status === 401 || status === 403) {
            toast.error("You need to sign in again to delete your account");
            setTimeout(() => navigate("/auth/user/signin"), 1500);
          } else if (status >= 500) {
            toast.error("Server error. Please try again later");
          } else {
            toast.error(`Failed to delete account: ${errorMessage}`);
          }
        } else if (error.request) {
          toast.error("Network error. Please check your internet connection.");
        } else {
          toast.error("Failed to delete account. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dark min-h-screen space-y-10 bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <NavBar backBtn />
      <div className="mx-auto space-y-6 relative p-4 border border-gray-700 rounded text-gray-300">
        {/* Header */}
        <p className="text-2xl text-center mb-6">Settings</p>
        {/* Profile Section */}
        <div className="space-y-7">
          {/* Profile Picture */}
          <div className="flex flex-col justify-center items-center mb-6">
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
              <Label htmlFor="name" className="flex justify-between">
                <span>Full Name</span>
                {formErrors.name && (
                  <span className="text-red-500 text-xs">
                    {formErrors.name}
                  </span>
                )}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (formErrors.name) {
                    const newErrors = { ...formErrors };
                    delete newErrors.name;
                    setFormErrors(newErrors);
                  }
                }}
                placeholder="Enter your full name"
                className={`bg-gray-800 ${
                  formErrors.name ? "border-red-500" : ""
                }`}
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
              <Label htmlFor="phone" className="flex justify-between">
                <span>Phone Number</span>
                {formErrors.phone && (
                  <span className="text-red-500 text-xs">
                    {formErrors.phone}
                  </span>
                )}
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (formErrors.phone) {
                    const newErrors = { ...formErrors };
                    delete newErrors.phone;
                    setFormErrors(newErrors);
                  }
                }}
                placeholder="+1 (123) 456-7890"
                className={`bg-gray-800 ${
                  formErrors.phone ? "border-red-500" : ""
                }`}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="flex justify-between">
                <span>Date of Birth</span>
                {formErrors.dob && (
                  <span className="text-red-500 text-xs">{formErrors.dob}</span>
                )}
              </Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                  if (formErrors.dob) {
                    const newErrors = { ...formErrors };
                    delete newErrors.dob;
                    setFormErrors(newErrors);
                  }
                }}
                className={`bg-gray-800 ${
                  formErrors.dob ? "border-red-500" : ""
                }`}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="flex justify-between">
                <span>Address</span>
                {formErrors.address && (
                  <span className="text-red-500 text-xs">
                    {formErrors.address}
                  </span>
                )}
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (formErrors.address) {
                    const newErrors = { ...formErrors };
                    delete newErrors.address;
                    setFormErrors(newErrors);
                  }
                }}
                placeholder="Your address"
                className={`bg-gray-800 ${
                  formErrors.address ? "border-red-500" : ""
                }`}
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

          <Button
            variant="default"
            className="w-full my-8"
            onClick={handleUpdateProfile}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>

          <div className="pt-7 border-t border-gray-700">
            <h3 className="text-lg font-medium mb-2">Account Information</h3>
            <p className="text-sm text-gray-400">User ID: {id}</p>
            <p className="text-sm text-gray-400">
              Account Created:{" "}
              {new Date(createdAt).toLocaleDateString([], {
                day: "2-digit",
              })}
              {"/"}
              {new Date(createdAt).toLocaleDateString([], {
                month: "2-digit",
              })}
              {"/"}
              {new Date(createdAt).toLocaleDateString([], {
                year: "2-digit",
              })}
              {", "}
              {new Date(createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
            <p className="text-sm text-gray-400">
              Last Updated:{" "}
              {new Date(updatedAt).toLocaleDateString([], {
                day: "2-digit",
              })}
              {"/"}
              {new Date(updatedAt).toLocaleDateString([], {
                month: "2-digit",
              })}
              {"/"}
              {new Date(updatedAt).toLocaleDateString([], {
                year: "2-digit",
              })}
              {", "}
              {new Date(updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>

          {/* Delete Account Section */}
          <div className="pt-7 border-t border-gray-700 pb-2">
            <h3 className="text-lg font-medium text-red-400">Danger Zone</h3>
            <p className="text-sm text-gray-400 mb-5">
              Deleting your account is permanent. All your data will be
              permanently removed and cannot be recovered.
            </p>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-900 border border-gray-700 text-gray-200">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-400">
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
