"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Roadmap = {
  id: string;
  title: string;
  description: string;
  _count: { modules: number };
};

export function AdminRoadmapManager({ initialRoadmaps }: { initialRoadmaps: Roadmap[] }) {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(initialRoadmaps);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this roadmap?")) return;
    
    try {
      const res = await fetch(`/api/admin/roadmap/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRoadmaps((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-[var(--card_bg)] p-6 rounded-xl border border-[var(--lines_color)]">
        <h3 className="text-xl font-bold text-[var(--text_color)] mb-4">Create New Roadmap</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text_color_weak)] mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[var(--body_bg)] border border-[var(--lines_color)] rounded p-2 text-white focus:border-[var(--main_color)] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text_color_weak)] mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[var(--body_bg)] border border-[var(--lines_color)] rounded p-2 text-white focus:border-[var(--main_color)] focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--main_color)] hover:bg-[var(--main_color_weak)] text-white font-medium px-4 py-2 rounded transition-colors"
          >
            {loading ? "Creating..." : "Create Roadmap"}
          </button>
        </form>
      </div>

      <div className="bg-[var(--card_bg)] rounded-xl border border-[var(--lines_color)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--card_item_bg)] border-b border-[var(--lines_color)] text-[var(--text_color_weak)]">
            <tr>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium">Description</th>
              <th className="p-4 font-medium text-center">Modules</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--lines_color)]">
            {roadmaps.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[var(--text_color_weak)]">
                  No roadmaps created yet.
                </td>
              </tr>
            ) : (
              roadmaps.map(roadmap => (
                <tr key={roadmap.id} className="hover:bg-[var(--card_item_bg)] transition-colors">
                  <td className="p-4 font-medium text-[var(--main_color)]">{roadmap.title}</td>
                  <td className="p-4 text-sm text-[var(--text_color_weak)]">{roadmap.description}</td>
                  <td className="p-4 text-center text-[var(--text_color)]">{roadmap._count.modules}</td>
                  <td className="p-4 text-right space-x-4">
                    <Link
                      href={`/admin/roadmap/${roadmap.id}`}
                      className="text-[var(--text_color_weak)] hover:text-[var(--text_color)] text-sm font-medium transition-colors"
                    >
                      Manage Modules
                    </Link>
                    <button
                      onClick={() => handleDelete(roadmap.id)}
                      className="text-red-500 hover:text-red-400 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
