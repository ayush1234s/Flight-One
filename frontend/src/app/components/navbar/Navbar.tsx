"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Plane, ChevronDown } from "lucide-react";
import { useAuth } from "@/app/context/AuthContent";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Booking", href: "/booking" },
  { name: "Tickets", href: "/tickets" },
  { name: "Traffic", href: "/traffic" },
  { name: "Cabs", href: "/cabs" },
  { name: "Map", href: "/map" },
  { name: "Help", href: "/support/help" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-sky-400 hover:text-sky-300 transition"
        >
          <Plane className="w-6 h-6" />
          Flight One
        </Link>

        {/* CENTER LINKS DESKTOP */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-medium transition-colors duration-200 ${active
                    ? "text-sky-400"
                    : "text-gray-300 hover:text-white"
                  } group`}
              >
                {link.name}

                <span
                  className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-sky-400 transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                />
              </Link>

            );
          })}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* DESKTOP AUTH */}
          {!user ? (
            <div className="hidden md:flex gap-3">
              <Link
                href="/login"
                className="border border-white/20 px-4 py-1.5 rounded-lg text-sm hover:bg-white/10 transition"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-sky-500 text-black px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-sky-400 transition"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div ref={profileRef} className="relative">

              {/* PROFILE BUTTON */}
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full px-1.5 py-1 hover:bg-white/5 transition"
              >
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt="profile"
                    width={36}
                    height={36}
                    className="rounded-full border border-white/20"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-sky-500 text-black flex items-center justify-center font-bold uppercase">
                    {(user.displayName || user.email || "U")[0]}
                  </div>
                )}

                <ChevronDown
                  size={16}
                  className={`transition ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* DROPDOWN */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur border border-white/10 rounded-xl overflow-hidden shadow-2xl">

                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium truncate">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                      setOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-red-400 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

{/* MOBILE MENU ICON */}
<button
  className="block text-sm transition-all duration-200 text-gray-300 hover:text-white"
  onClick={() => setOpen(!open)}
>
  {open ? <X /> : <Menu />}
</button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur border-t border-white/10 px-6 py-4 space-y-4">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block text-sm transition ${pathname === link.href
                  ? "text-sky-400"
                  : "text-gray-300 hover:text-white"
                }`}
            >
              {link.name}
            </Link>
          ))}

          {/* MOBILE AUTH */}
          <div className="pt-4 border-t border-white/10">
            {!user ? (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center border border-white/20 py-2 rounded-lg hover:bg-white/10 transition"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center bg-sky-500 text-black py-2 rounded-lg font-semibold hover:bg-sky-400 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full border border-white/20 py-2 rounded-lg text-red-400 hover:bg-white/5 transition"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
