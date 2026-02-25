export const getDeltaOfObjects = (source: any, target: any) => {
  const delta: Record<string, any> = {};
  for (const key of Object.keys(target)) {
    if (source[key] !== target[key]) {
      delta[key] = target[key];
    }
  }
  return delta;
};
