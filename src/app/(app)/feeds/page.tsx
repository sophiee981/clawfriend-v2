import { Feeds } from "@/features/feeds";
import { Suspense } from "react";

export default async function FeedsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><div className="text-neutral-tertiary">Loading...</div></div>}>
            <Feeds />
        </Suspense>
    );
}
