import { getSessionUser } from "@/lib/auth/session";
import { Navbar } from "@/components/layout/Navbar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return (
    <div className="min-h-screen">
      {user && <Navbar user={user} />}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">{children}</main>
    </div>
  );
}
