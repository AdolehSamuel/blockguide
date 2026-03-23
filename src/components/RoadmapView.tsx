"use client";

import { useState } from "react";

type Module = {
  id: string;
  title: string;
  content: string;
  order: number;
};

type Progress = {
  moduleId: string;
  completed: boolean;
};

type RoadmapViewProps = {
  roadmap: {
    title: string;
    description: string;
    modules: Module[];
  };
  progress: Progress[];
};

export default function RoadmapView({ roadmap, progress }: RoadmapViewProps) {
  const [localProgress, setLocalProgress] = useState<Progress[]>(progress);

  const isCompleted = (moduleId: string) => {
    return localProgress.find((p) => p.moduleId === moduleId)?.completed || false;
  };

  const toggleModule = async (moduleId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Optimistic update
    setLocalProgress((prev) => {
      const existing = prev.find((p) => p.moduleId === moduleId);
      if (existing) {
        return prev.map((p) => p.moduleId === moduleId ? { ...p, completed: newStatus } : p);
      }
      return [...prev, { moduleId, completed: newStatus }];
    });

    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, completed: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update progress");
    }
  };

  const totalCompleted = roadmap.modules.filter((m) => isCompleted(m.id)).length;
  const progressPercent = Math.round((totalCompleted / (roadmap.modules.length || 1)) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-[var(--card_bg)] p-6 rounded-xl border border-[var(--main_color_weak)]">
        <h2 className="text-2xl font-bold text-[var(--main_color)] mb-2">{roadmap.title}</h2>
        <p className="text-[var(--text_color_weak)] mb-4">{roadmap.description}</p>
        
        <div className="w-full bg-[var(--body_bg)] rounded-full h-4 mb-2 overflow-hidden border border-[var(--lines_color)]">
          <div
            className="bg-[var(--main_color)] h-4 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-sm text-right text-[var(--text_color_weak)]">{progressPercent}% Completed</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[var(--text_color)]">Modules</h3>
        {roadmap.modules.map((mod, index) => {
          const completed = isCompleted(mod.id);
          return (
            <div key={mod.id} className="bg-[var(--card_item_bg)] p-5 rounded-lg border border-[var(--lines_color)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className="font-semibold text-[var(--text_color)] text-lg">
                  {index + 1}. {mod.title}
                </h4>
                <p className="text-[var(--text_color_weak)] mt-1">{mod.content}</p>
              </div>
              <button
                onClick={() => toggleModule(mod.id, completed)}
                className={`px-4 py-2 rounded shrink-0 font-medium transition-colors ${
                  completed
                    ? "bg-[var(--main_color)] text-white"
                    : "bg-[var(--body_bg)] border border-[var(--lines_color)] text-[var(--text_color_weak)] hover:text-white"
                }`}
              >
                {completed ? "Completed" : "Mark Complete"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
