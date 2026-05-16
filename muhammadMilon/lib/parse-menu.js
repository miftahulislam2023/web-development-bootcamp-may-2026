/** Parse menu lines: "Label" or "Label|/url" or "Dropdown>Child|/url" */
export function parseMenuItems(raw) {
  const lines = String(raw || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const items = [];
  let currentDropdown = null;

  for (const line of lines) {
    if (line.startsWith(">")) {
      const inner = line.slice(1).trim();
      const [label, href = "#"] = inner.split("|").map((s) => s.trim());
      if (currentDropdown) {
        currentDropdown.children.push({ label, href });
      }
      continue;
    }
    if (line.toLowerCase().startsWith("dropdown:")) {
      const label = line.slice(9).trim() || "Menu";
      currentDropdown = { label, href: "#", children: [] };
      items.push(currentDropdown);
      continue;
    }
    const [label, href = "#"] = line.split("|").map((s) => s.trim());
    currentDropdown = null;
    items.push({ label, href, children: [] });
  }
  return items;
}

export function parseSocialLinks(raw) {
  return String(raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [network, url] = pair.split(":").map((x) => x.trim());
      return { network: network?.toLowerCase() || "link", url: url || "#" };
    });
}

export function parseFooterColumns(raw) {
  const blocks = String(raw || "").split("---").map((b) => b.trim()).filter(Boolean);
  return blocks.map((block) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const title = lines[0] || "Links";
    const links = lines.slice(1).map((l) => {
      const [label, href = "#"] = l.split("|").map((s) => s.trim());
      return { label, href };
    });
    return { title, links };
  });
}
