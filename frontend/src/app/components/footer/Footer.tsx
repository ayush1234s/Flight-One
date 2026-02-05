import Link from "next/link";
import { Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

        {/* BRAND */}
        <div>
          <div className="flex items-center gap-2 text-sky-400 font-bold text-lg">
            <Plane className="w-5 h-5" />
            Flight One
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Smart travel companion for flight comparison, live tracking,
            cab estimates and route planning.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/booking" className="hover:text-white">Booking</Link></li>
            <li><Link href="/tickets" className="hover:text-white">Tickets</Link></li>
            <li><Link href="/traffic" className="hover:text-white">Traffic</Link></li>
            <li><Link href="/cabs" className="hover:text-white">Cabs</Link></li>
            <li><Link href="/map" className="hover:text-white">Map</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/support/help" className="hover:text-white">Help Center</Link></li>
            <li><Link href="/support/contact" className="hover:text-white">Contact</Link></li>
            
          </ul>
        </div>

        {/* COPYRIGHT */}
        <div className="text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Flight One.  
            All rights reserved.
          </p>
          <p className="mt-2">
            Educational project — real booking handled by partner platforms.
          </p>
          <p className="mt-2">
            Made by ❤️ Ayush Srivastava.
          </p>
        </div>
      </div>
    </footer>
  );
}
