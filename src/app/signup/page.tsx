"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Signup failed");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--card_bg)] p-8 rounded-xl border border-[var(--lines_color)] shadow-xl">
        <h1 className="text-2xl font-bold text-[var(--text_color)] mb-6 text-center">Join BlockGuide</h1>
        
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[var(--text_color_weak)] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--body_bg)] border border-[var(--lines_color)] rounded p-2 text-white focus:border-[var(--main_color)] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text_color_weak)] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--body_bg)] border border-[var(--lines_color)] rounded p-2 text-white focus:border-[var(--main_color)] focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text_color_weak)] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--body_bg)] border border-[var(--lines_color)] rounded p-2 text-white focus:border-[var(--main_color)] focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--main_color)] hover:bg-[var(--main_color_weak)] text-white font-medium py-2 rounded transition-colors"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-[var(--text_color_weak)]">
          Already have an account? <Link href="/login" className="text-[var(--main_color)] hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
