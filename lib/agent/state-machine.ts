export type ClaimStage =
  | "greeting"
  | "identifying_policy"
  | "coverage_caveat"
  | "fact_gathering"
  | "visual_inspection"
  | "voice_confirmation"
  | "closed";

export function stageFromToolCall(toolName: string, currentStage: ClaimStage): ClaimStage {
  switch (toolName) {
    case "match_policy":
      return "identifying_policy";
    case "check_coverage":
      return "coverage_caveat";
    case "update_claim_field":
      if (currentStage === "greeting" || currentStage === "identifying_policy" || currentStage === "coverage_caveat") {
        return "fact_gathering";
      }
      return currentStage;
    case "request_visual_inspection":
      return "visual_inspection";
    case "finalize_claim":
      return "closed";
    default:
      return currentStage;
  }
}

export const STAGE_LABELS: Record<ClaimStage, string> = {
  greeting: "Connecting",
  identifying_policy: "Identifying policy",
  coverage_caveat: "Checking coverage",
  fact_gathering: "Gathering details",
  visual_inspection: "Visual inspection",
  voice_confirmation: "Confirming",
  closed: "Complete",
};
