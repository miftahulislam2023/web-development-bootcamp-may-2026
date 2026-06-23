export const normalizeTags = (tags: string[]) => {
  return [...new Set(tags.map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0))];
};
