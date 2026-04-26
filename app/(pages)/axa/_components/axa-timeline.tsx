"use client";

import { CheckCircle2, Phone, Search, FileText, Shield, CreditCard } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

type StepState = "done" | "active" | "pending";

const STEPS = [
  {
    id: 1,
    title: "Schadenaufnahme",
    subtitle: "Daten erfasst per Sprachanruf",
    Icon: Phone,
  },
  {
    id: 2,
    title: "Deckungsprüfung",
    subtitle: "Police und Bedingungen werden geprüft",
    Icon: Shield,
  },
  {
    id: 3,
    title: "Rechnungsprüfung",
    subtitle: "Belege und Rechnung werden bewertet",
    Icon: FileText,
  },
  {
    id: 4,
    title: "Finale Prüfung",
    subtitle: "Abschließende Freigabe durch Sachbearbeiter",
    Icon: Search,
  },
  {
    id: 5,
    title: "Zahlungsauftrag",
    subtitle: "Auszahlung an Ihre IBAN",
    Icon: CreditCard,
  },
];

function statesFromClaim(claim?: Doc<"claims"> | null): StepState[] {
  if (!claim) return ["done", "active", "pending", "pending", "pending"];
  switch (claim.status) {
    case "call":
      return ["active", "pending", "pending", "pending", "pending"];
    case "draft":
      return ["done", "active", "pending", "pending", "pending"];
    case "in_review":
      return ["done", "done", "active", "pending", "pending"];
    case "accepted":
      return ["done", "done", "done", "done", "done"];
    case "rejected":
      return ["done", "done", "done", "active", "pending"];
    default:
      return ["done", "active", "pending", "pending", "pending"];
  }
}

export function AxaTimeline({
  claim,
}: {
  claim: Doc<"claims"> | null | undefined;
}) {
  const states = statesFromClaim(claim);

  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.12em] text-[#666666] font-bold mb-4">
        Nächste Schritte
      </h2>
      <ol className="relative pl-8">
        {/* Vertical connector track */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-[#E0E0E0]" />

        {STEPS.map((step, i) => {
          const s = states[i];
          const { Icon } = step;
          return (
            <li key={step.id} className="relative pb-6 last:pb-0">
              {/* State dot */}
              <div className="absolute -left-[21px] top-0.5 w-6 h-6 flex items-center justify-center">
                {s === "done" && (
                  <div className="w-6 h-6 rounded-full bg-[#00008F] flex items-center justify-center">
                    <CheckCircle2
                      className="w-4 h-4 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                )}
                {s === "active" && (
                  <>
                    <div className="absolute w-6 h-6 rounded-full bg-[#00008F]/25 animate-ping" />
                    <div className="relative w-4 h-4 rounded-full bg-[#00008F] shadow-[0_0_0_3px_rgba(0,0,143,0.2)]" />
                  </>
                )}
                {s === "pending" && (
                  <div className="w-3 h-3 rounded-full bg-[#DDDDDD]" />
                )}
              </div>

              <div className="flex items-start gap-3">
                {/* Icon box */}
                <div
                  className={`w-9 h-9 rounded-[6px] flex items-center justify-center shrink-0 ${
                    s === "done"
                      ? "bg-[#E8E8FF]"
                      : s === "active"
                      ? "bg-[#F0F0FF]"
                      : "bg-[#F5F5F5]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      s === "pending" ? "text-[#BBBBBB]" : "text-[#00008F]"
                    }`}
                    strokeWidth={1.8}
                  />
                </div>
                {/* Text */}
                <div>
                  <p
                    className={`text-[14px] font-semibold leading-snug ${
                      s === "pending" ? "text-[#BBBBBB]" : "text-[#1A1A1A]"
                    }`}
                  >
                    {step.title}
                    {s === "active" && (
                      <span className="ml-2 text-[11px] font-medium text-[#00008F] bg-[#E8E8FF] px-2 py-0.5 rounded-full align-middle">
                        Aktuell
                      </span>
                    )}
                  </p>
                  <p
                    className={`text-[12px] mt-0.5 ${
                      s === "pending" ? "text-[#CCCCCC]" : "text-[#666666]"
                    }`}
                  >
                    {step.subtitle}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
