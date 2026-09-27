import { CalendarDays,Clock3,Navigation,Plus,Ticket } from "lucide-react";
import { useArena } from "../shared/ArenaProvider";
import { openMaps,openWaze } from "../../lib/navigation";
import { formatArenaDate } from "../../data/mockCourts";

const money=(v:number)=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

export function ReservationsScreen({onBook,onHome}:{onBook:()=>void;onHome:()=>void}) {
  const {reservations}=useArena();
  return <section className="content-section section-pad page-space"><div className="page-heading"><span className="section-kicker">SEUS JOGOS</span><h1>Minhas reservas</h1><p>Próximos jogos e vouchers na palma da mão.</p></div><div className="tabs"><button className="active">Próximas <b>{reservations.length}</b></button><button>Histórico</button></div>
    {reservations.length?<div className="reservation-list">{reservations.map((reservation)=><article className="reservation-card" key={reservation.id}><div className="reservation-photo"><img src={reservation.court.image} alt={reservation.court.name}/><span>CONFIRMADA</span></div><div className="reservation-info"><div className="reservation-top"><div><span>{reservation.court.area}</span><h2>{reservation.court.name}</h2></div><strong>{money(reservation.total)}</strong></div><p><CalendarDays size={14}/> {formatArenaDate(reservation.day)}</p><p><Clock3 size={14}/> {reservation.slots.join(" • ")} · {reservation.slots.length}h</p><p><Ticket size={14}/> {reservation.players} jogadores</p><div className="reservation-actions"><button onClick={()=>openWaze(reservation.court)}><Navigation size={14}/> Waze</button><button onClick={()=>openMaps(reservation.court)}>Maps</button></div></div></article>)}</div>:<div className="empty"><Ticket size={25}/><h3>Nenhuma reserva ainda</h3><p>Escolha uma quadra e marque o próximo jogo.</p></div>}
    <button className="secondary full" onClick={onBook}><Plus size={17}/> Fazer nova reserva</button><button className="under-action" onClick={onHome}>Voltar para início</button>
  </section>;
}
