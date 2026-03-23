"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Module = {
  id: string;
  title: string;
  content: string;
  order: number;
};

export function AdminModuleManager({ roadmapId, initialModules }: { roadmapId: string; initialModules: Module[] }) {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [order, setOrder] = useState(modules.length > 0 ? Math.max(...modules.map(m => m.order)) + 1 : 1);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    
    try {
      const res = await fetch(`/api/admin/module/${id}`, { method: "DELETE" });
      if (res.ok) {
        setModules((prev) => prev.filter((m) => m.id !== id));
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
      const res = await fetch("/api/admin/module", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roadmapId, title, content, order }),
      });

      if (res.ok) {
        const body = await res.json();
        setModules(prev => [...prev, body.module].sort((a,b) => a.order - b.order));
        setTitle("");
        setContent("");
        setOrder(prev => prev + 1);
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
      <div className="mb-4">
         <Link href="/admin" className="text-[var(--main_color)] hover:underline">&larr; Back to Roadmaps</Link>
      </div>

      <div className="bg-[var(--card_bg)] p-6 rounded-xl border border-[var(--lines_color)]">
        <h3 className="text-xl font-bold text-[var(--text_color)] mb-4">Add New Module</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-[var(--text_color_weak)] mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[var(--body_bg)] border border-[var(--lines_color)] rounded p-2 text-white focus:border-[var(--main_color)] focus:outline-none"
                required
              />
            </div>
            <div className="w-24">
              <label className="block text-sm text-[var(--text_color_weak)] mb-1">Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full bg-[var(--body_bg)] border border-[var(--lines_color)] rounded p-2 text-white focus:border-[var(--main_color)] focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--text_color_weak)] mb-1">Content (Tutorial Text)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[var(--body_bg)] border border-[var(--lines_color)] rounded p-2 text-white focus:border-[var(--main_color)] focus:outline-none min-h-[100px]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[var(--main_color)] hover:bg-[var(--main_color_weak)] text-white font-medium px-4 py-2 rounded transition-colors"
          >
            {loading ? "Adding..." : "Add Module"}
          </button>
        </form>
      </div>

      <div className="bg-[var(--card_bg)] rounded-xl border border-[var(--lines_color)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[var(--card_item_bg)] border-b border-[var(--lines_color)] text-[var(--text_color_weak)]">
            <tr>
              <th className="p-4 font-medium w-16">Order</th>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--lines_color)]">
            {modules.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-8 text-center text-[var(--text_color_weak)]">
                  No modules created for this roadmap yet.
                </td>
              </tr>
            ) : (
              modules.map(mod => (
                <tr key={mod.id} className="hover:bg-[var(--card_item_bg)] transition-colors">
                  <td className="p-4 text-[var(--text_color)]">{mod.order}</td>
                  <td className="p-4 font-medium text-[var(--main_color)]">{mod.title}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(mod.id)}
                      className="text-red-500 hover:text-red-400 text-sm font-medium"
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
