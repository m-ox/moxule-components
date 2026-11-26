export interface BreadcrumbNode {
  x: number;
  top: number;
  rail: number;
  slant: number;
}

// Each wrapped row gets its own rail so connections never cross labels.
export function breadcrumbConnectors(nodes: readonly BreadcrumbNode[]): string {
  if (nodes.length < 2) return "";
  const rows: BreadcrumbNode[][] = [];
  for (const node of nodes) {
    const row = rows[rows.length - 1];
    if (!row || Math.abs(row[0].rail - node.rail) > 2) rows.push([node]);
    else row.push(node);
  }
  const current = nodes[nodes.length - 1];
  return rows.flatMap((row) => {
    const first = row[0];
    const last = row[row.length - 1];
    const end = last === current ? Math.max(first.x, last.x - last.slant) : last.x;
    const rail = row.length > 1 ? [`M ${first.x} ${first.rail} H ${end}`] : [];
    return [...rail, ...row.map((node) => node === current
      ? `M ${Math.max(0, node.x - node.slant)} ${node.rail} L ${node.x} ${node.top}`
      : `M ${node.x} ${node.rail} V ${node.top}`)];
  }).join(" ");
}
