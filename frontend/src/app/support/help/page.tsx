"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    q: "How do I search and compare flights?",
    a: "Go to the Booking page, select your departure city and arrival airport, choose your travel date, and click Search. You can view all available flights sorted by price and duration.",
  },
  {
    q: "How does flight booking work?",
    a: "Flight One compares flight options across major airlines. When you click 'Book on Airline Website', you are taken directly to the official airline site (like Air India, IndiGo, SpiceJet, or Vistara) to complete your booking safely.",
  },
  {
    q: "How do I view my flight tickets?",
    a: "Go to the Tickets page. If you sign in with Google, Flight One can check your booking confirmation emails and display your ticket details automatically.",
  },
  {
    q: "How does live flight tracking work?",
    a: "On the Traffic and Map pages, you can view live aircraft positions, altitude, speed, and origin/destination countries for active flights.",
  },
  {
    q: "How do I compare cab fares?",
    a: "Go to the Cabs page, enter your pickup and drop locations (or select an airport), and choose your vehicle type (Bike, Auto, or Car). You will see estimated fares for Uber, Ola, and Rapido so you can choose the best price.",
  },
  {
    q: "How does airport weather status work?",
    a: "On the Chaos page, you can view current weather conditions (temperature, wind speed, fog/rain) and travel safety advisories for major airports before leaving for your flight.",
  },
  {
    q: "How do I contact customer support?",
    a: "You can visit the Contact Support page to send us a message or request assistance with your account.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Title */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Help Center
        </h1>
        <p className="text-gray-400 text-sm">
          Find answers to common questions about using Flight One.
        </p>
      </div>

      {/* FAQs List */}
      <div className="space-y-3 mb-12">
        {FAQS.map((item, i) => (
          <div
            key={i}
            className="border border-white/10 bg-white/5 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex justify-between items-center px-6 py-4 text-left cursor-pointer hover:bg-white/5 transition"
            >
              <span className="font-medium text-white text-sm sm:text-base">
                {item.q}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  openIndex === i ? "rotate-180 text-sky-400" : ""
                }`}
              />
            </button>

            {openIndex === i && (
              <div className="px-6 pb-5 text-gray-300 text-sm leading-relaxed border-t border-white/5 pt-4">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Need More Help Footer */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
        <h3 className="font-semibold text-white mb-1">Still need help?</h3>
        <p className="text-gray-400 text-xs mb-4">
          Contact our support team for assistance.
        </p>
        <Link
          href="/support/contact"
          className="inline-block px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs transition cursor-pointer"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
