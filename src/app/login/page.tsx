"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-[var(--card_bg)] p-8 rounded-xl border border-[var(--lines_color)] shadow-xl">
        <h1 className="text-2xl font-bold text-[var(--text_color)] mb-6 text-center">Login to BlockGuide</h1>
        
        {error && <div className="bg-red-500/10 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <p className="mt-4 text-center text-sm text-[var(--text_color_weak)]">
          Don't have an account? <Link href="/signup" className="text-[var(--main_color)] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
