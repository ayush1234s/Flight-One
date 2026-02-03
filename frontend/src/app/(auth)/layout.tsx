export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-500 hover:border-sky-400/40">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            ✈️ Flight<span className="text-sky-400">One</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Smart Air Travel Assistant
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}
