/**
 * return plus one day of the date
 *
 * @param date - yyyy-MM-dd format date string
 * @return yyyy-MM-dd format date string
 */
export function addDay(date: string): string{
    const day = parseInt(date.substring(8, 10))+1;
    if(day<10){
        return date.substring(0, 8) + "0" + day.toString();
    }else{
        return date.substring(0, 8) + day.toString();
    }
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