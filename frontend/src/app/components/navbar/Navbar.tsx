import React from "react";  
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-black/70 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="text-xl font-bold text-white">
          ✈️ Flight<span className="text-sky-400">One</span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex gap-6 text-sm text-gray-300">
          <Link href="/" className="hover:text-white">Home</Link>
          <Link href="/booking" className="hover:text-white">Booking</Link>
          <Link href="/tickets" className="hover:text-white">Tickets</Link>
          <Link href="/traffic" className="hover:text-white">Traffic</Link>
          <Link href="/cabs" className="hover:text-white">Cabs</Link>
          <Link href="/map" className="hover:text-white">Map</Link>
          <Link href="/support/help" className="hover:text-white">Help</Link>
        </div>

        {/* AUTH */}
        <div className="flex gap-3">
          <Link
            href="/login"
            className="border border-white/20 px-4 py-2 rounded-lg text-sm hover:bg-white/10"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="bg-sky-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-400"
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
