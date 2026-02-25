export const generateUniqueToken = () =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
