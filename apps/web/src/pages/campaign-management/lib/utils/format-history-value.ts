export const formatHistoryValue = (val: any) => {
  if (val === null || val === undefined) return '—';
  if (Array.isArray(val) || typeof val === 'object') {
    try {
      return JSON.stringify(val);
    } catch (e) {
      return String(val);
    }
  }
  return val;
};
