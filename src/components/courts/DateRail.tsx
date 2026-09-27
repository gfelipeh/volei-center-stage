import { CalendarDays } from "lucide-react";
import { dates } from "../../data/mockCourts";
export function DateRail({value,setValue}:{value:string;setValue:(value:string)=>void}) {
  return <div className="date-rail">{dates.map((date)=><button key={date.day} className={value===date.day?"active":""} onClick={()=>setValue(date.day)}><span>{date.label}</span><b>{date.day}</b><small>{date.month}</small></button>)}<button className="date-more" onClick={()=>setValue(dates[4].day)}><CalendarDays size={18}/> Mais dias</button></div>;
}
