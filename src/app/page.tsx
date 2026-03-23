import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col min-h-screen bg-[var(--body_bg)] text-[var(--text_color)]">
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to <span className="text-[var(--main_color)]">BlockGuide</span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text_color_weak)] max-w-2xl mb-8">
          An interactive, chat-based platform guiding African youth through personalized blockchain learning paths.
        </p>

        {session ? (
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-[var(--main_color)] hover:bg-[var(--main_color_weak)] text-white font-medium rounded-lg transition-colors text-lg"
          >
            Go to Dashboard
          </Link>
        ) : (
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="px-8 py-3 bg-[var(--main_color)] hover:bg-[var(--main_color_weak)] text-white font-medium rounded-lg transition-colors text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-[var(--card_item_bg)] hover:bg-[var(--lines_color)] text-white border border-[var(--lines_color)] font-medium rounded-lg transition-colors text-lg"
            >
              Login
            </Link>
          </div>
        )}
      </main>
      <footer className="py-6 text-center text-sm text-[var(--text_color_weak)] border-t border-[var(--lines_color)]">
        &copy; {new Date().getFullYear()} BlockGuide. All rights reserved.
      </footer>
    </div>
  );
}
