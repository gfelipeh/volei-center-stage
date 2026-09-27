import { MessageCircle,Navigation,Ticket } from "lucide-react";
import type { Reservation } from "../../types/arena";
import { formatArenaDate } from "../../data/mockCourts";
import { openMaps,openWaze,shareOnWhatsApp } from "../../lib/navigation";

const money=(v:number)=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
export function Voucher({reservation}:{reservation:Reservation}) {
  const perPerson=reservation.players?reservation.total/reservation.players:reservation.total;
  const message="🏐 *Partiu Vôlei!*\nQuadra reservada na *"+reservation.court.name+"*\n📅 Data: "+formatArenaDate(reservation.day)+" às "+reservation.slots.join(" • ")+"\n👥 Total: "+money(reservation.total)+" (apenas "+money(perPerson)+"/pessoa para "+reservation.players+" jogadores)\n📍 Local: "+reservation.court.neighborhood+" - Veja o comprovante no app!";
  return <div className="voucher"><div className="voucher-top"><div><span>ARENA VÔLEI</span><b>{reservation.court.name}</b></div><Ticket size={24}/></div><div className="voucher-data"><div><small>DATA</small><b>{formatArenaDate(reservation.day).toUpperCase()}</b></div><div><small>HORÁRIO</small><b>{reservation.slots.join(" • ")}</b></div><div><small>TOTAL</small><b>{money(reservation.total)}</b></div></div><div className="voucher-actions"><span>#{reservation.id.slice(-8).toUpperCase()}</span><button onClick={()=>shareOnWhatsApp(message)}><MessageCircle size={15}/> WhatsApp</button><button onClick={()=>openWaze(reservation.court)}><Navigation size={15}/> Waze</button><button onClick={()=>openMaps(reservation.court)}>Maps</button></div></div>;
}
