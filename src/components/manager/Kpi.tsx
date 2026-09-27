import type { ReactNode } from "react";
export function Kpi({label,value,change,icon}:{label:string;value:string;change:string;icon:ReactNode}) {
  return <div className="kpi"><span>{icon}</span><small>{label}</small><strong>{value}</strong><em>{change}</em></div>;
}
