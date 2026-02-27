import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Workout Tracker",
  description: "Track your workouts and progress",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="fixed bottom-0 left-0 right-0 bg-[#18181b]/95 backdrop-blur-xl border-t border-[#3f3f46] safe-area-pb z-50">
          <div className="flex justify-around items-center max-w-md mx-auto h-16">
            <Link href="/" className="flex flex-col items-center justify-center gap-1 px-6 py-2 text-xs font-medium text-[#71717a] hover:text-[#22c55e] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Today</span>
            </Link>
            <Link href="/history" className="flex flex-col items-center justify-center gap-1 px-6 py-2 text-xs font-medium text-[#71717a] hover:text-[#22c55e] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>History</span>
            </Link>
            <Link href="/progress" className="flex flex-col items-center justify-center gap-1 px-6 py-2 text-xs font-medium text-[#71717a] hover:text-[#22c55e] transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Progress</span>
            </Link>
          </div>
        </nav>
        <main className="min-h-screen pb-20 px-4 pt-6 max-w-md mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
