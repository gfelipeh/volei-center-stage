import { Home,Search,Ticket,UserRound } from "lucide-react";
import type { ReactNode } from "react";
import type { Screen } from "../../types/arena";

const items:{id:Screen;label:string;icon:ReactNode}[] = [
  {id:"home",label:"Início",icon:<Home/>},{id:"search",label:"Buscar",icon:<Search/>},{id:"reservations",label:"Reservas",icon:<Ticket/>},{id:"profile",label:"Perfil",icon:<UserRound/>},
];
export function BottomNav({screen,navigate}:{screen:Screen;navigate:(screen:Screen)=>void}) {
  return <nav className="bottom-nav" aria-label="Navegação principal">{items.map((item)=><button key={item.id} className={screen===item.id?"active":""} onClick={()=>navigate(item.id)}>{item.icon}<span>{item.label}</span></button>)}</nav>;
}
