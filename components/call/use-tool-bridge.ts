"use client";

import { useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { ToolCallPayload } from "./types";

export function useToolBridge(sessionId: string) {
  const matchPolicy = useMutation(api.tools.matchPolicy);
  const checkCoverage = useMutation(api.tools.checkCoverage);
  const updateClaimField = useMutation(api.tools.updateClaimField);
  const requestVisualInspection = useMutation(api.tools.requestVisualInspection);
  const finalizeClaim = useMutation(api.tools.finalizeClaim);

  const handleToolCall = useCallback(
    async (call: ToolCallPayload): Promise<unknown> => {
      const args = call.args as Record<string, any>;

      switch (call.name) {
        case "match_policy":
          return matchPolicy({
            sessionId,
            lossHypothesis: args.lossHypothesis as string,
            productCategory: args.productCategory as string | undefined,
            policyType: args.policyType as string | undefined,
          });

        case "check_coverage":
          return checkCoverage({
            sessionId,
            policyId: args.policyId as any,
          });

        case "update_claim_field":
          return updateClaimField({
            sessionId,
            incidentType: args.incidentType,
            incidentDate: args.incidentDate,
            incidentLocation: args.incidentLocation,
            productCategory: args.productCategory,
            productBrandModel: args.productBrandModel,
            purchaseDate: args.purchaseDate,
            damageSummary: args.damageSummary,
            estimatedDamageEur: args.estimatedDamageEur,
            callerEmail: args.callerEmail,
          });

        case "request_visual_inspection":
          // Fire-and-forget. Gemini Live closes the WS if the tool response
          // takes longer than ~500ms; the Convex round-trip (patch + db.get +
          // event push) reliably trips that. Local optimistic state in
          // IosCallScreen already surfaces the button instantly — the mutation
          // is just persistence so the flag survives a reload.
          requestVisualInspection({
            sessionId,
            reason: args.reason as "policy_required" | "user_offered" | "agent_suggested",
            hint: args.hint,
          }).catch(console.error);
          return { ok: true };

        case "finalize_claim":
          return finalizeClaim({
            sessionId,
            summary: args.summary as string,
            callerEmail: args.callerEmail as string | undefined,
            transcriptText: args.transcriptText as string | undefined,
            requiredUploads: args.requiredUploads as
              | Array<{ id: string; title: string; description: string; required: boolean }>
              | undefined,
          });

        default:
          console.warn("Unknown tool call:", call.name);
          return { error: `Unknown tool: ${call.name}` };
      }
    },
    [sessionId, matchPolicy, checkCoverage, updateClaimField, requestVisualInspection, finalizeClaim]
  );

  return { handleToolCall };
}
