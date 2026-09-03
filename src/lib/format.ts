const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatMonth(value: string): string {
  if (!value) return '';
  const [y, m] = value.split('-');
  const idx = Number(m) - 1;
  if (!y || Number.isNaN(idx) || idx < 0 || idx > 11) return value;
  return `${MONTHS[idx]} ${y}`;
}

export function formatRange(start: string, end: string, current: boolean): string {
  const s = formatMonth(start);
  const e = current ? 'Present' : formatMonth(end);
  if (!s && !e) return '';
  if (!e) return s;
  return `${s} — ${e}`;
}
