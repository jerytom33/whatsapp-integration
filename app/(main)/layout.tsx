"use client";

import { Sidebar } from "@/components/sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-muted/20">
                <div className="mx-auto max-w-6xl h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
