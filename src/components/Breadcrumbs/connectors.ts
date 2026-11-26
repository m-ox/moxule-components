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
    if (row.length > 1) {
      const radius = Math.max(0, Math.min(5, (first.top - first.rail) / 2, (end - first.x) / 4));
      let line = `M ${first.x} ${first.top} V ${first.rail + radius} Q ${first.x} ${first.rail} ${first.x + radius} ${first.rail} H ${end - radius}`;
      if (last === current) {
        const height = last.top - last.rail;
        const length = Math.hypot(last.slant, height) || 1;
        const x = end + last.slant / length * radius;
        const y = last.rail + height / length * radius;
        line += ` Q ${end} ${last.rail} ${x} ${y} L ${last.x} ${last.top}`;
      } else {
        line += ` Q ${end} ${last.rail} ${end} ${last.rail + radius} V ${last.top}`;
      }
      return [line, ...row.slice(1, -1).map((node) => `M ${node.x} ${node.rail} V ${node.top}`)];
    }
    return row.map((node) => node === current
      ? `M ${Math.max(0, node.x - node.slant)} ${node.rail} L ${node.x} ${node.top}`
      : `M ${node.x} ${node.rail} V ${node.top}`);
  }).join(" ");
}
