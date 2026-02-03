const HomePage = () => {
  return (
    <section className="bg-slate-950 text-white">

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">

        <div>
          <h1 className="text-5xl font-bold leading-tight">
            All-in-One Platform for
            <span className="text-sky-400"> Smart Air Travel</span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg leading-relaxed">
            Flight One reduces travel hassle by unifying flight discovery, booking reference access, live
            flight tracking, and local transport planning — ideal for frequent travelers, students, and
            travel managers.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/booking"
              className="bg-sky-500 px-6 py-3 rounded-lg text-black font-semibold hover:bg-sky-400"
            >
              Search Flights
            </a>

            <a
              href="/tickets"
              className="border border-white/20 px-6 py-3 rounded-lg hover:bg-white/10"
            >
              Fetch My Tickets
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h3 className="text-xl font-semibold mb-4">
            What Flight One Offers
          </h3>

          <ul className="space-y-3 text-gray-300 text-sm">
            <li>✈️ Flight search and comparison</li>
            <li>📩 Email & PNR based ticket retrieval</li>
            <li>🕒 Past, ongoing and upcoming flight history</li>
            <li>🛰️ Live flight traffic and delay alerts</li>
            <li>🚕 Cab comparison for airport travel</li>
            <li>🗺️ Live route planning and traffic maps</li>
          </ul>
        </div>
      </div>

      {/* PURPOSE SECTION */}
      <div className="border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Why Flight One?
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Air travel often requires switching between multiple apps for flight
            search, ticket access, tracking updates, cab booking, and navigation.
            Flight One eliminates this complexity by combining all essential
            travel tools into a single integrated platform.
          </p>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold text-center mb-16">
            How Flight One Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="border border-white/10 bg-white/5 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Step 1</h3>
              <p className="text-gray-400 text-sm">
                User signs up using email and provides consent to access
                flight-related information securely.
              </p>
            </div>

            <div className="border border-white/10 bg-white/5 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Step 2</h3>
              <p className="text-gray-400 text-sm">
                User searches available flights or retrieves existing tickets
                using email or PNR reference.
              </p>
            </div>

            <div className="border border-white/10 bg-white/5 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Step 3</h3>
              <p className="text-gray-400 text-sm">
                The system fetches real-time information through secure backend
                services and processes the results.
              </p>
            </div>

            <div className="border border-white/10 bg-white/5 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Step 4</h3>
              <p className="text-gray-400 text-sm">
                Users view results and are redirected safely to official airline
                or transport platforms for booking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES GRID */}
      <div className="border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-3 gap-8">

          {[
            "Flight Discovery and Comparison",
            "Secure Ticket Retrieval System",
            "Live Flight Traffic Monitoring",
            "Airport Cab Comparison",
            "Real-Time Map and Traffic View",
            "Privacy-First Consent Based Design",
          ].map((feature) => (
            <div
              key={feature}
              className="border border-white/10 bg-white/5 rounded-xl p-6"
            >
              <h3 className="font-semibold text-lg mb-2">
                {feature}
              </h3>
              <p className="text-gray-400 text-sm">
                Designed following real-world aviation and travel workflows.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOT NOTE */}
      <div className="bg-slate-950 py-16 text-center text-sm text-gray-500">
        Flight One does not process payments or store booking data.
        All bookings are redirected to official airline websites.
      </div>

    </section>
  );
};

export default HomePage;
