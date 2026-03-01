type DzRecord = Record<string, any>;

export function formatChatSummary(summary: DzRecord | null): { campaign: DzRecord | null; lineItems: DzRecord | DzRecord[] | null } | null {
  const campaign = Object.keys(summary?.campaign || {}).length
    ? (summary?.campaign as DzRecord)
    : null;
  const lineItems = Object.keys(summary?.lineItems || {}).length
    ? (summary?.lineItems as DzRecord | DzRecord[])
    : null;

  const chatSummary = campaign || lineItems ? { campaign, lineItems } : null;

  return chatSummary;
}
