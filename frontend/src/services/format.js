export function formatIndianNumber(value) {
  if (value === null || value === undefined || value === '') return '';

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return String(value);

  return new Intl.NumberFormat('en-IN').format(numericValue);
}