/**
 * return plus one day of the date
 *
 * @param date - yyyy-MM-dd format date string
 * @return yyyy-MM-dd format date string
 */
export function addDay(date: string): string{
  return toDateString(addDays(toDate(date), 1));
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

export function toDateTimeString(date: Date): string {
    const d = toDateString(date);
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    let hh = h.toString();
    let mm = m.toString();
    let ss = s.toString();
    if(h < 10){
        hh = "0" + h.toString();
    }
    if(m < 10){
        mm = "0" + m.toString();
    }
    if(s < 10){
        ss = "0" + s.toString();
    }
    return `${d} ${hh}:${mm}:${ss}`
}

export function toDateHHMMString(date: Date): string {
    const d = toDateString(date);
    const h = date.getHours();
    const m = date.getMinutes();
    let hh = h.toString();
    let mm = m.toString();
    if(h < 10){
        hh = "0" + h.toString();
    }
    if(m < 10){
        mm = "0" + m.toString();
    }
    return `${d}T${hh}:${mm}`
}

export function toYM(date: Date): string{
    return toDateString(date).substring(0, 7);
}

function hhmm(h: string, m: string): string{
    const a1 = parseInt(h);
    const a2 = parseInt(m);
    let hh = h;
    let mm = m;
    if(a1 < 10){
        hh = `0${a1}`;
    }
    if(a2 < 10){
        mm = `0${a2}`;
    }
    return `${hh}:${mm}`;
}

export function toHHMM(time: string): string{
    if(time.length >= 6){
        return "";
    }
    if(time.indexOf(":") >= 1){
        if(time.length === 5){
            return time;
        }else{
            const ar = time.split(":");
            return hhmm(ar[0], ar[1]);
        }
    }else if(time.length === 4){
        return time.substring(0, 2) + ":" + time.substring(2, 4);
    }else if(time.length === 3){
        return hhmm(time.substring(0, 1), time.substring(1, 3));
    }else if(time.length === 2){
        return hhmm(time.substring(0, 1), time.substring(1, 2));
    }
    return "";
}

export function getToday(): Date{
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getTodayString(): string {
    return toDateString(new Date());
}

export function toLocalDateString(date: Date): string{
    const yyyy = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${yyyy}年${m}月${d}日`;
}

export function toDate(date: string): Date{
    return new Date(Date.parse(date));
}

export function getAge(birthday: string, baseday: Date): number{
    const birth = toDate(birthday);
    const yyyy1 = birth.getFullYear();
    const yyyy2 = baseday.getFullYear();
    const age = yyyy2 - yyyy1;
    if(baseday.getMonth() > birth.getMonth()){
        return age;
    }
    if(baseday.getMonth() === birth.getMonth()){
        if(baseday.getDate() >= birth.getDate()){
            return age;
        }else{
            return age - 1;
        }
    }
    return age - 1;
}

export function addDays(date: Date, d: number):Date{
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + d);
}


const weeks = ["日","月","火","水","木","金","土"];
export function getWeekName(date: string){
    const d = toDate(date);
    return weeks[d.getDay()]
}