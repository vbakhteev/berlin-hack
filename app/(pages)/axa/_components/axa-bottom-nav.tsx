"use client";

import { Home, FileText, AlertCircle, User } from "lucide-react";

const ITEMS = [
  { id: "overview", label: "Übersicht", Icon: Home },
  { id: "contracts", label: "Verträge", Icon: FileText },
  { id: "claims", label: "Schäden", Icon: AlertCircle },
  { id: "profile", label: "Profil", Icon: User },
] as const;

type NavId = typeof ITEMS[number]["id"];

export function AxaBottomNav({ active }: { active: NavId }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-white border-t border-[#E0E0E0] z-30"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 12px)" }}
    >
      <div className="grid grid-cols-4">
        {ITEMS.map(({ id, label, Icon }) => {
          const isActive = id === active;
          return (
            <button
              key={id}
              className="flex flex-col items-center justify-center py-2 gap-0.5"
            >
              <Icon
                className="w-5 h-5"
                strokeWidth={isActive ? 2.2 : 1.6}
                color={isActive ? "#00008F" : "#999999"}
              />
              <span
                className={`text-[10px] ${
                  isActive
                    ? "text-[#00008F] font-semibold"
                    : "text-[#999999] font-medium"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
