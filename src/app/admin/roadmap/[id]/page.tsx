import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { AdminModuleManager } from "@/components/AdminModuleManager";

export default async function AdminRoadmapModulesPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const { id } = await params;

  const roadmap = await prisma.roadmap.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!roadmap) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[var(--body_bg)] flex">
      <aside className="w-64 bg-[var(--card_bg)] border-r border-[var(--lines_color)] p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-[var(--main_color)] tracking-tight">BlockGuide</h1>
        <p className="text-sm border-b border-[var(--lines_color)] pb-4 mb-4 text-[var(--text_color_weak)]">
          Admin Portal
        </p>
        <nav className="space-y-2">
          <a href="/dashboard" className="block text-[var(--text_color_weak)] hover:text-[var(--main_color)] transition-colors">
            Exit to Dashboard
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-[var(--text_color)] mb-2">Manage Modules: {roadmap.title}</h2>
          <p className="text-[var(--text_color_weak)]">{roadmap.description}</p>
        </header>

        <section>
          <AdminModuleManager roadmapId={roadmap.id} initialModules={roadmap.modules} />
        </section>
      </main>
    </div>
  );
}
