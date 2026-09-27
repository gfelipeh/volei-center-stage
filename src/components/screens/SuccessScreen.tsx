import { ArrowRight,ChevronRight,Check,Ticket } from "lucide-react";
import type { Reservation } from "../../types/arena";
import { Voucher } from "../booking/Voucher";

export function SuccessScreen({reservation,onHome,onReservations}:{reservation:Reservation|null;onHome:()=>void;onReservations:()=>void}) {
  if (!reservation) return <section className="success"><div className="success-icon"><Check size={39}/></div><h1>Reserva salva!</h1><button className="primary full" onClick={onHome}>Voltar para início</button></section>;
  return <section className="success"><div className="success-icon"><Check size={39} strokeWidth={3}/></div><span className="eyebrow">RESERVA CONFIRMADA</span><h1>Partiu jogo! 🏐</h1><p>Seu horário está garantido. Salve o voucher e compartilhe com a galera.</p><Voucher reservation={reservation}/><div className="success-actions"><button className="primary full" onClick={onReservations}>Ver minhas reservas <Ticket size={17}/></button><button className="secondary full" onClick={onHome}>Voltar para início <ChevronRight size={16}/></button></div></section>;
}
