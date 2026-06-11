export const generateSku = (name: string): string => {
  return name.toUpperCase().replace(/\s+/g, "-").slice(0, 10);
};
