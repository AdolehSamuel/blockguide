import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { AdminRoadmapManager } from "@/components/AdminRoadmapManager";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const roadmaps = await prisma.roadmap.findMany({
    include: {
      _count: {
        select: { modules: true }
      }
    }
  });

  const users = await prisma.user.count();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--body_bg)] p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center border-b border-[var(--lines_color)] pb-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--main_color)]">Admin Dashboard</h1>
          <p className="text-[var(--text_color_weak)]">Manage BlockGuide content</p>
        </div>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-sm px-4 py-2 border border-[var(--lines_color)] hover:bg-[var(--card_item_bg)] rounded text-[var(--text_color)]">
            Learner View
          </a>
          <a href="/api/auth/signout" className="text-sm px-4 py-2 bg-[var(--card_item_bg)] border border-[var(--lines_color)] hover:bg-[var(--lines_color)] rounded text-[var(--text_color)]">
            Logout
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--card_bg)] p-6 rounded-xl border border-[var(--lines_color)]">
            <h3 className="text-[var(--text_color_weak)] text-sm uppercase tracking-wider mb-2">Total Learners</h3>
            <p className="text-4xl font-bold text-[var(--text_color)]">{users}</p>
          </div>
          <div className="bg-[var(--card_bg)] p-6 rounded-xl border border-[var(--lines_color)]">
            <h3 className="text-[var(--text_color_weak)] text-sm uppercase tracking-wider mb-2">Total Roadmaps</h3>
            <p className="text-4xl font-bold text-[var(--text_color)]">{roadmaps.length}</p>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[var(--text_color)]">Roadmaps Overview</h2>
          </div>
          <AdminRoadmapManager initialRoadmaps={roadmaps} />
        </section>
      </main>
    </div>
  );
}
