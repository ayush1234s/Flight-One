import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import { AuthProvider } from "./context/AuthContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flight One — Smart Travel Companion",
  description:
    "Compare flights, track journeys, manage tickets and travel smarter with Flight One.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-950 text-white antialiased">
        <AuthProvider>
          <Navbar />
          <main className="pt-20 min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
