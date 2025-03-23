import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Logo from "./Logo";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface IUser {
  id: string;
  pfp: string;
  name: string;
  email: string;
  createdAt: Date;
}

export default function NavBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    async function fetchUser() {
      await axios
        .get("/api/v1/auth/user/whoami", {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            setUser(res?.data?.data?.user);
          }
        })
        .catch((error) => {
          toast.error(
            `Error ${error.response.data.error.code}: ${error.response.data.error.message}`
          );
          setUser(undefined);
          navigate("/auth/user/signin");
        });
    }
    fetchUser();
  }, []);

  async function handleSignOut() {
    await axios
      .get("/api/v1/auth/user/signout", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          window.location.href = "/auth/user/signin";
        }
      })
      .catch((error) => {
        toast.error(
          `Error ${error.response.data.error.code}: ${error.response.data.error.message}`
        );
      });
  }

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg mb-12 border border-gray-700">
      <div className="flex items-center gap-2">
        <Logo className="w-10" />
        <h1 className="text-2xl font-mono">QuickAid</h1>
      </div>
      <div className="relative flex items-center gap-2 text-sm">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center gap-2 hover:cursor-pointer">
              {/* <p className="text-lg">{user?.name}</p> */}
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.pfp} alt={user?.name} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm">{user?.name}</p>
                <p className="text-sm">{user?.email}</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link to="/user/account">
              <DropdownMenuItem className="hover:cursor-pointer">
                Account
              </DropdownMenuItem>
            </Link>
            <Link to="/user/history">
              <DropdownMenuItem className="hover:cursor-pointer">
                History
              </DropdownMenuItem>
            </Link>
            <Link to="/user/settings">
              <DropdownMenuItem className="hover:cursor-pointer">
                Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="hover:cursor-pointer"
              onClick={handleSignOut}
            >
              <p className="text-red-600">Sign Out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
