/**
 * Client-side CSV export (works without a backend).
 * Usage: exportCsv('users', headers, rows)
 */
export default function exportCsv(filename, headers, rows) {
  const escape = (cell) => {
    const value = cell === null || cell === undefined ? '' : String(cell);
    return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  };

  const csv = [headers.map(escape).join(','), ...rows.map((row) => row.map(escape).join(','))].join('\n');

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }); // BOM: fixes Excel encoding
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
