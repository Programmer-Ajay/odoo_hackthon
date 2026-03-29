"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { userData } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      dispatch(setUserData(null));
      toast.success("Logged out");
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-40 w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-black tracking-tighter text-primary">ReimburseIt</span>
            </Link>
            {userData && (
              <div className="hidden md:flex items-center gap-6">
                <Link href="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                {userData.role === 'Admin' && (
                  <Link href="/admin" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
                    Admin Panel
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {userData ? (
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-foreground">{userData.name}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-none bg-primary/10 px-1.5 py-0.5 rounded">
                    {userData.role}
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block"></div>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-bold text-destructive hover:text-destructive/80 transition-colors flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/signin" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
