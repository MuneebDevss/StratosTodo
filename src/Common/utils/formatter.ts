export function formatMinutes(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h}h ${m}m`
}


export function navigate(dateStr: string, direction: 1 | -1): string {
  // Append 'T00:00:00' so the browser evaluates this strictly as local time
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + direction);
  return getLocalISODate(d);
}

export function getLocalISODate(date = new Date()): string {
  const offset = date.getTimezoneOffset();
  // Adjust the time by subtracting the local timezone offset
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
}


export function getLocalISOStartOfDate(date = new Date(),start = false): string {
  if (start) {
    date.setUTCHours(0, 0, 0, 0);
  }
  else {
  date.setUTCHours(0, 0, 0, 0);
  }
  return date.toISOString();
}