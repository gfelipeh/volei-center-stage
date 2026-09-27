import type { ReactNode } from "react";
export function SectionTitle({ kicker,title,action }:{kicker:string;title:string;action?:ReactNode}) {
  return <div className="section-title"><div><span className="section-kicker">{kicker}</span><h2>{title}</h2></div>{action}</div>;
}
