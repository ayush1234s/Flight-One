import Link from "next/link";
import { Plane } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        {/* BRAND & DESCRIPTION */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-lg">
            <Plane className="w-5 h-5" />
            Flight One
          </div>
          <p className="text-gray-400 text-sm mt-3 max-w-md leading-relaxed">
            Flight One is your smart travel companion for real-time flight search, fare comparison, live air traffic radar, cab estimates, and travel status.
          </p>
        </div>

        {/* SUPPORT */}
        <div>
          <h4 className="font-semibold text-white mb-3 text-sm">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/support/contact" className="hover:text-sky-400 transition">
                Contact & Help Center
              </Link>
            </li>
            <li>
              <Link href="/support/contact" className="hover:text-sky-400 transition">
                Customer Support
              </Link>
            </li>
          </ul>
        </div>

        {/* COPYRIGHT & CREDIT */}
        <div className="text-xs text-gray-400 space-y-2">
          <p className="font-medium text-gray-300">
            © 2026 Flight One. All rights reserved.
          </p>
          <p className="text-gray-400">
            Educational project — real booking handled by partner platforms.
          </p>
          <p className="text-gray-300 font-medium pt-1">
            Made with ❤️ Ayush Srivastava.
          </p>
        </div>
      </div>
    </footer>
  );
}
