export function formatVersion(version: string): string {
  // Clean version string (remove ^, ~, >=, etc.)
  return version.replace(/^[\^~>=<\s]+/, "");
}

export function formatAuthor(
  author: string | { name: string; email?: string; url?: string } | undefined,
): string {
  if (!author) return "Not specified";

  if (typeof author === "string") return author;

  const parts: string[] = [];
  if (author.name) parts.push(author.name);
  if (author.email) parts.push(`<${author.email}>`);
  if (author.url) parts.push(`(${author.url})`);

  return parts.join(" ") || "Not specified";
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function truncateString(str: string, maxLength: number = 50): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "...";
}
