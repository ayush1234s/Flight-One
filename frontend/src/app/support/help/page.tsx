"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

/* ================= SHIMMER ITEM ================= */
const ShimmerItem = () => {
  return (
    <div className="border border-white/10 bg-white/5 rounded-xl p-6 animate-pulse">
      <div className="h-4 w-3/4 bg-white/10 rounded mb-3" />
      <div className="h-3 w-full bg-white/10 rounded" />
    </div>
  );
};

const faqs = [
  {
    q: "What is Flight One?",
    a: "Flight One is a smart travel assistant that helps users search flights, fetch tickets, track live flights, compare airport cabs, and view routes — all in one platform.",
  },
  {
    q: "How do I search and compare flights?",
    a: "Go to the Booking page, enter source, destination, date, passengers and class. The system shows available flights and allows comparison based on price and duration.",
  },
  {
    q: "Why am I redirected to airline websites for booking?",
    a: "Flight One does not handle payments. Users are redirected to official airline or partner websites to complete bookings safely.",
  },
  {
    q: "How does ticket fetching work?",
    a: "If you login using Google, Flight One can check your Gmail (with consent) for flight confirmation emails and display ticket information.",
  },
  {
    q: "Why Google login is required for tickets?",
    a: "Email-based login does not provide Gmail access. Google login is required to securely detect flight booking emails.",
  },
  {
    q: "Is my Gmail data stored?",
    a: "No. Flight One does not store or save your emails. Ticket detection is temporary and consent-based.",
  },
  {
    q: "How does live flight tracking work?",
    a: "Live flight tracking uses public aviation data to estimate aircraft position, speed, altitude, and status.",
  },
  {
    q: "What is shown in cab comparison?",
    a: "Cab comparison shows estimated fare, ETA, and vehicle options. Actual booking happens on partner apps.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-3xl font-bold mb-10 text-center text-gray-300">
          Help Center
        </h1>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ShimmerItem key={i} />
          ))}
        </div>
      </div>
    );
  }

  /* ================= MAIN CONTENT ================= */
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold mb-10 text-center">
        Help Center
      </h1>

      <div className="space-y-4">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="border border-white/10 bg-white/5 rounded-xl"
          >
            {/* QUESTION */}
            <button
              onClick={() => toggle(i)}
              className="w-full flex justify-between items-center px-6 py-4 text-left"
            >
              <span className="font-medium">
                {item.q}
              </span>
              <ChevronDown
                className={`transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* ANSWER */}
            {openIndex === i && (
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
