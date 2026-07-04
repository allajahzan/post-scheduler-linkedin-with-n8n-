"use client";

import { useUser } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullScreenLoader } from "@/components/ui/loader";
import { Navbar } from "../layout/navbar";
import { Footer } from "../layout/footer";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useUser();
  const user = data?.user;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || !user)) {
      router.replace("/login");
    }
  }, [isLoading, isError, user, router]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError || !user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen pt-[70px]">
      <Navbar />
      <main className="relative flex-1 overflow-hidden">
        {/* Top-left ambient glow */}
        <div
          className="pointer-events-none fixed -top-10 -left-10 h-[300px] w-[300px] rounded-full opacity-30 blur-3xl"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          }}
        />
        {/* Top-right ambient glow */}
        <div
          className="pointer-events-none fixed -top-10 -right-10 h-[300px] w-[300px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          }}
        />
        {children}
      </main>
      <Footer />
    </div>
  );
}
