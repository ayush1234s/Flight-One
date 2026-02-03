"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import { useAuth } from "@/app/context/AuthContent";
import { useRouter } from "next/navigation";

const ProfileMenu = () => {
  const { user } = useAuth();
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="relative group">
      {/* PROFILE ICON */}
      <div className="w-9 h-9 rounded-full bg-sky-500 text-black flex items-center justify-center font-bold cursor-pointer">
        {user.email?.charAt(0).toUpperCase()}
      </div>

      {/* DROPDOWN */}
      <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-white/10 rounded-xl opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all">
        <div className="px-4 py-3 border-b border-white/10 text-sm text-gray-300">
          {user.email}
        </div>

        <button
          onClick={logout}
          className="w-full text-left px-4 py-3 text-sm hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileMenu;
