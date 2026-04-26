"use client";

import { Upload, CheckCircle2 } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

export function AxaRequiredUploads({
  claim,
}: {
  claim: Doc<"claims"> | null | undefined;
}) {
  const uploads = claim?.requiredUploads ?? [];
  if (uploads.length === 0) return null;

  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-[#666666] font-bold mb-2">
        Benötigte Dokumente
      </h2>
      <div className="space-y-2">
        {uploads.map((u) => {
          const done = u.status === "uploaded";
          return (
            <div
              key={u.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-[8px] border ${
                done
                  ? "bg-[#F0FFF4] border-[#16A34A]/25"
                  : "bg-white border-[#E0E0E0] border-dashed"
              }`}
            >
              {done ? (
                <CheckCircle2
                  className="w-5 h-5 text-[#16A34A] shrink-0"
                  strokeWidth={2}
                />
              ) : (
                <Upload
                  className="w-5 h-5 text-[#00008F] shrink-0"
                  strokeWidth={1.8}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-[#1A1A1A] truncate">
                  {u.title}
                </p>
                <p className="text-[11px] text-[#666666] truncate">
                  {u.description}
                </p>
              </div>
              {!done && (
                <button className="text-[11px] uppercase tracking-[0.08em] font-bold text-[#00008F] px-3 py-1.5 border border-[#00008F] rounded-[4px] whitespace-nowrap hover:bg-[#F0F0FF] transition-colors">
                  Hochladen
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
