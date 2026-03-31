import { Suspense } from "react";
import { Nav } from "@/components/layout/nav";
import { TopBar } from "@/components/layout/top-bar";
import { WalkthroughOverlay } from "@/components/walkthrough-overlay";

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Nav />
      <div className="ml-64 flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Suspense fallback={null}>
        <WalkthroughOverlay />
      </Suspense>
    </div>
  );
}
