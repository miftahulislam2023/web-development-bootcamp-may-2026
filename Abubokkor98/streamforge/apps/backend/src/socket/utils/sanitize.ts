// ─── HTML Entity Escaping for Chat Messages ───
// Strips dangerous characters to prevent XSS when rendering plain text.
// Chat messages are never rendered as HTML on the frontend, but we sanitize
// at the persistence layer as a defense-in-depth measure.

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const DANGEROUS_CHARS_REGEX = /[&<>"']/g;

export function escapeHtml(text: string): string {
  return text.replace(DANGEROUS_CHARS_REGEX, (char) => HTML_ENTITY_MAP[char] ?? char);
}
