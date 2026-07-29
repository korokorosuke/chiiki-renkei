/**
 * return plus one day of the date
 *
 * @param date - yyyy-MM-dd format date string
 * @return yyyy-MM-dd format date string
 */
export function addDay(date: string): string{
  const t = Temporal.PlainDate.from(date).add({ days: 1 });
  return t.toString();
}

/**
 * return the next month of the date
 *
 * @param date - yyyy-MM-dd format date string
 * @return yyyy-MM-dd format date string
 */
export function getNextMonth(date: string): string{
  const t = Temporal.PlainDate.from(date).add({ months: 1 });
  return t.toString();
}

/**
 * return the last day of the month of the date
 *
 * @param date - yyyy-MM-dd format date string
 * @return yyyy-MM-dd format date string
 */
export function getMonthLast(date: string): string{
  const t = Temporal.PlainDate.from(date).with({ day: 1 }).add({ months: 1, days: -1 });
  return t.toString();
}

/**
 * return yyyy-MM-dd format date string of the date
 *
 * @param date - Date object
 * @return yyyy-MM-dd format date string
 */
export function toDateString(date: Date): string{
  const yyyy = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  let mm = m.toString();
  let dd = d.toString();
  if(m < 10){
      mm = "0" + m.toString();
  }
  if(d < 10){
      dd = "0" + d.toString();
  }
  return `${yyyy}-${mm}-${dd}`;
}