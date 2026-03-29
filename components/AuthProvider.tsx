"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/redux/userSlice";
import axios from "axios";
import { RootState } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { userData } = useSelector((state: RootState) => state.user);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await axios.get("/api/user");
        if (data.success) {
          dispatch(setUserData(data.user));
        }
      } catch (error) {
        console.error("Auth check failed");
        // Only redirect if we're not already on a public page
        if (pathname !== "/" && pathname !== "/signin" && pathname !== "/signup") {
          router.push("/signin");
        }
      } finally {
        setChecking(false);
      }
    };

    if (!userData) {
      initAuth();
    } else {
      setChecking(false);
    }
  }, [dispatch, userData, pathname, router]);

  if (checking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Initializing Session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
