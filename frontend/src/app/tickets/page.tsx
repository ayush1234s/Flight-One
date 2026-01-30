"use client";

import { useState } from "react";
import { Mail, Ticket, AlertCircle } from "lucide-react";

const TicketsPage = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);

  const connectGmail = async () => {
    setConnected(true);
    setLoading(true);

    // REAL CASE:
    // backend Gmail API will run here
    // but since no flight emails exist → empty result

    setTimeout(() => {
      setTickets([]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-24">

      <h1 className="text-3xl font-bold mb-2">
        My Flight Tickets
      </h1>

      <p className="text-gray-400 mb-10">
        Fetch your booked flight tickets using your email securely.
      </p>

      {/* CONNECT GMAIL */}
      {!connected && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">

          <Mail size={40} className="mx-auto text-sky-400 mb-4" />

          <h2 className="text-xl font-semibold mb-2">
            Connect your Gmail
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            We only scan flight-related email metadata.
            Your personal emails remain private.
          </p>

          <button
            onClick={connectGmail}
            className="bg-sky-500 px-6 py-3 rounded-lg text-black font-semibold hover:bg-sky-400"
          >
            Connect Gmail
          </button>
        </div>
      )}

      {/* LOADING */}
      {connected && loading && (
        <div className="mt-16 text-center text-gray-400">
          Scanning your email for flight tickets...
        </div>
      )}

      {/* NO TICKETS FOUND */}
      {connected && !loading && tickets.length === 0 && (
        <div className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-10 text-center">

          <AlertCircle size={40} className="mx-auto text-yellow-400 mb-4" />

          <h2 className="text-xl font-semibold mb-2">
            No Flight Tickets Found
          </h2>

          <p className="text-gray-400 text-sm">
            Your email does not contain any flight booking information.
          </p>
        </div>
      )}

      {/* FUTURE REAL TICKETS */}
      {tickets.length > 0 && (
        <div className="mt-10 space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6"
            >
              <Ticket className="text-sky-400 mb-2" />
              {ticket.snippet}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketsPage;
