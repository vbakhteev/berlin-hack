// Policy data lives in policyTemplates.ts, not the database.
// This file is kept as a thin re-export for any legacy imports.
export { POLICY_TEMPLATES, POLICY_TEMPLATES_BY_ID, getPolicyTemplate, isPolicyTypeId } from "./policyTemplates";
export type { PolicyTemplate, PolicyTypeId } from "./policyTemplates";
