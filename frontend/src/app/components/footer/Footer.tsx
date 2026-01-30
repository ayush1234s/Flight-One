import React from "react";
const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/70 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">

        <div>
          <h2 className="text-white font-bold text-lg">
            Flight<span className="text-sky-400">One</span>
          </h2>
          <p className="text-sm mt-3">
            A unified flight travel assistant for smart and secure journey
            planning.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>Flight Booking</li>
            <li>Ticket Retrieval</li>
            <li>Live Tracking</li>
            <li>Maps & Traffic</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>Help Center</li>
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Note</h4>
          <p className="text-sm">
            This project is built for educational purposes only. No payments or
            ticket storage is performed.
          </p>
        </div>
      </div>

      <div className="text-center text-xs border-t border-white/10 py-4">
        © {new Date().getFullYear()} Flight One. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
