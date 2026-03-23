import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      conversations: {
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[var(--body_bg)] p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center border-b border-[var(--lines_color)] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text_color)]">My Dashboard</h1>
          <p className="text-[var(--text_color_weak)]">Welcome back, {user.name}</p>
        </div>
        <div className="flex gap-4">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-sm px-4 py-2 bg-[var(--main_color)] hover:bg-[var(--main_color_weak)] rounded text-white transition-colors"
            >
              Admin Panel
            </Link>
          )}
          <a
            href="/api/auth/signout"
            className="text-sm px-4 py-2 border border-[var(--lines_color)] hover:bg-[var(--card_item_bg)] rounded text-[var(--text_color)] transition-colors"
          >
            Logout
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--text_color)]">Your BlockGuide Conversations</h2>
          <Link
            href="/dashboard/chat/new"
            className="px-6 py-2 bg-[var(--main_color)] hover:bg-[var(--main_color_weak)] text-white font-medium rounded-lg transition-colors shadow-lg"
          >
            + Start New Chat
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {user.conversations.length === 0 ? (
            <div className="bg-[var(--card_bg)] border border-[var(--lines_color)] rounded-xl p-8 text-center text-[var(--text_color_weak)]">
              You haven't started any conversations yet. Click "Start New Chat" to begin exploring learning paths!
            </div>
          ) : (
            user.conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/dashboard/chat/${conv.id}`}
                className="bg-[var(--card_bg)] hover:bg-[var(--card_item_bg)] border border-[var(--lines_color)] rounded-xl p-6 transition-colors shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold text-[var(--main_color)]">{conv.title}</h3>
                  <p className="text-sm text-[var(--text_color_weak)] mt-1">
                    Last active: {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-[var(--text_color_weak)] group-hover:text-[var(--text_color)] transition-colors">
                  &rarr;
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
