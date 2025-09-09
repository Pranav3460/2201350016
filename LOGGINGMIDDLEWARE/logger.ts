export const logEvent = (level: string, category: string, data: any) => {
  console.log(`[${level.toUpperCase()}] ${category}:`, data);
};
