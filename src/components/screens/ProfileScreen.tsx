import { ChevronRight,ShieldCheck,Star,Ticket,WalletCards } from "lucide-react";
import { useArena } from "../shared/ArenaProvider";

export function ProfileScreen({onManager,onReservations}:{onManager:()=>void;onReservations:()=>void}) {
  const {favorites,reservations}=useArena();
  const items=[
    {icon:<Ticket/>,title:"Minhas reservas",detail:reservations.length+" reservas",action:onReservations},
    {icon:<Star/>,title:"Favoritos",detail:favorites.length+" quadras salvas"},
    {icon:<WalletCards/>,title:"Pagamentos",detail:"PIX e cartões"},
    {icon:<ShieldCheck/>,title:"Segurança",detail:"Conta protegida"},
  ];
  return <section className="content-section section-pad page-space"><div className="profile-head"><div className="avatar">JC</div><div><span className="section-kicker">JOGADOR</span><h1>João Campos</h1><p>Conta pessoal · Arena Vôlei</p></div></div><div className="profile-grid">{items.map((item)=><button className="profile-item" key={item.title} onClick={item.action}>{item.icon}<div><b>{item.title}</b><small>{item.detail}</small></div><ChevronRight size={17}/></button>)}</div>
    <div className="profile-callout"><span className="eyebrow dark">ARENA PARA GESTORES</span><h2>Quer colocar sua quadra aqui?</h2><p>Organize horários, ocupação, check-in e faturamento em um só lugar.</p><button className="primary" onClick={onManager}>Conhecer painel</button></div>
  </section>;
}
