"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AxaHeader } from "./_components/axa-header";
import { AxaBottomNav } from "./_components/axa-bottom-nav";
import { AxaPolicyCard } from "./_components/axa-policy-card";
import { AxaClaimCta } from "./_components/axa-claim-cta";
import { AxaClaimNotification } from "./_components/axa-claim-notification";
import { MOCK_CUSTOMER, MOCK_POLICIES } from "@/lib/axa/mock-customer";
import Image from "next/image";

const nanoid = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

export default function AxaHomePage() {
  const router = useRouter();
  const createClaim = useMutation(api.claims.create);
  const claims = useQuery(api.claims.byUser);

  const startCall = async () => {
    const sessionId = nanoid();
    try {
      await createClaim({ sessionId });
    } catch (e) {
      console.error("[AXA] createClaim failed:", e);
    }
    router.push(`/axa/call?sessionId=${sessionId}`);
  };

  // Show notification for the most recent finalized claim
  const newestFinalized = claims?.find(
    (c) => c.status === "draft" || c.status === "in_review"
  );

  return (
    <main className="min-h-[100dvh] bg-[#F5F5F5] pb-24">
      <AxaHeader onPhoneTap={startCall} />

      {/* Hero banner */}
      <div className="bg-[#00008F] px-5 pt-6 pb-5">
        <p className="text-white/70 text-[13px] font-medium">
          Willkommen bei
        </p>
        <h1 className="text-white text-[26px] font-bold leading-tight mt-0.5">
          My AXA
        </h1>
        <p className="text-white/80 text-[14px] mt-1">
          Guten Morgen, {MOCK_CUSTOMER.firstName} {MOCK_CUSTOMER.lastName}
        </p>
      </div>

      {/* Quick action cards */}
      <div className="px-5 mt-3 space-y-3">
        {/* New claim notification */}
        {newestFinalized && (
          <AxaClaimNotification claim={newestFinalized} />
        )}

        {/* Main CTA */}
        <AxaClaimCta onTap={startCall} />
      </div>

      {/* Policies section */}
      <section className="px-5 mt-6">
        <h2 className="text-[11px] font-bold text-[#666666] uppercase tracking-[0.12em] mb-3">
          Meine Verträge
        </h2>
        <div className="space-y-2">
          {MOCK_POLICIES.map((p) => (
            <AxaPolicyCard key={p.policyNumber} policy={p} />
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section className="px-5 mt-6">
        <h2 className="text-[11px] font-bold text-[#666666] uppercase tracking-[0.12em] mb-3">
          Schnellzugriff
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Dokumente", sub: "Policen & Briefe" },
            { label: "Bankverbindung", sub: "IBAN verwalten" },
            { label: "Kontakt", sub: "AXA erreichen" },
            { label: "Einstellungen", sub: "Konto & Datenschutz" },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white border border-[#E0E0E0] rounded-[6px] px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <p className="text-[13px] font-semibold text-[#1A1A1A]">
                {item.label}
              </p>
              <p className="text-[11px] text-[#999999] mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="px-5 mt-8 mb-4 flex items-center justify-between">
        <Image
          src="/axa-logo.png"
          alt="AXA"
          width={48}
          height={18}
          className="h-4 w-auto opacity-30 object-contain"
        />
        <p className="text-[10px] text-[#BBBBBB]">
          Mitglied seit {MOCK_CUSTOMER.memberSince}
        </p>
      </div>

      <AxaBottomNav active="overview" />
    </main>
  );
}
