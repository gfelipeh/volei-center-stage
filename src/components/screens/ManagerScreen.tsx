import { ArrowLeft,ArrowRight,Check,Clock3,LockKeyhole,Ticket,UnlockKeyhole,WalletCards,Zap } from "lucide-react";
import { useMemo,useState } from "react";
import { courts,slotGroups } from "../../data/mockCourts";
import { useArena } from "../shared/ArenaProvider";
import { DateRail } from "../courts/DateRail";
import { SectionTitle } from "../shared/SectionTitle";
import { Kpi } from "../manager/Kpi";

const money=(v:number)=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

export function ManagerScreen({onBack,onClientView}:{onBack:()=>void;onClientView:(courtId:number)=>void}) {
  const {reservations,getSlotStatus,toggleBlockedSlot,showToast}=useArena();
  const [managerCourtId,setManagerCourtId]=useState(courts[0]!.id);
  const [day,setDay]=useState("27");
  const court=courts.find((item)=>item.id===managerCourtId)??courts[0]!;
  const reserved=reservations.filter((item)=>item.court.id===court.id);
  const dayReservations=reserved.filter((item)=>item.day===day);
  const revenue=reserved.reduce((sum,item)=>sum+item.total,0);
  const reservedHours=reserved.reduce((sum,item)=>sum+item.slots.length,0);
  const dayReservedHours=dayReservations.reduce((sum,item)=>sum+item.slots.length,0);
  const totalHours=slotGroups.reduce((sum,group)=>sum+group.values.length,0);
  const occupancy=totalHours?Math.round((dayReservedHours/totalHours)*100):0;
  const values=useMemo(()=>slotGroups.flatMap((group)=>group.values.map((slot)=>({slot,status:getSlotStatus(court.id,day,slot)}))),[court.id,day,getSlotStatus]);
  return <section className="content-section section-pad page-space manager"><div className="manager-head"><button className="back-link" onClick={onBack}><ArrowLeft size={17}/> App</button><div><span className="section-kicker">PAINEL DO GESTOR</span><h1>{court.name}</h1></div><span className="operating"><i/> Operando</span></div>
    <div className="manager-courts">{courts.map((item)=><button className={item.id===court.id?"active":""} key={item.id} onClick={()=>setManagerCourtId(item.id)}>{item.name}</button>)}</div>
    <div className="manager-toolbar"><DateRail value={day} setValue={setDay}/><button className="ghost-pill" onClick={()=>onClientView(court.id)}>Ver como cliente <ArrowRight size={14}/></button></div>
    <div className="kpi-grid"><Kpi label="Ocupação no dia" value={occupancy+"%"} change={dayReservedHours+"h reservadas"} icon={<Zap/>}/><Kpi label="Faturamento total" value={money(revenue)} change={reserved.length+" reservas"} icon={<WalletCards/>}/><Kpi label="Horas vendidas" value={String(reservedHours)} change="histórico persistido" icon={<Ticket/>}/></div>
    <div className="card-surface manager-slots"><SectionTitle kicker="GESTÃO DE HORÁRIOS" title="Toque para bloquear ou liberar"/><p className="manager-help">Bloqueios ficam salvos no navegador e aparecem imediatamente no agendamento do cliente.</p><div className="manager-slot-grid">{values.map(({slot,status})=>{const locked=status==="blocked";const taken=status==="taken";return <button key={slot} disabled={taken} className={"manager-slot "+(locked?"blocked ":"")+(taken?"taken":"")} onClick={()=>{toggleBlockedSlot(court.id,day,slot);showToast(locked?"Horário liberado!":"Horário bloqueado!");}}><span>{slot}</span>{taken?<><Ticket size={15}/><small>Reservado</small></>:locked?<><LockKeyhole size={15}/><small>Bloqueado</small></>:<><UnlockKeyhole size={15}/><small>Livre</small></>}</button>})}</div><div className="manager-legend"><span><i className="green"/> Livre</span><span><i className="blocked-legend"/> Bloqueado</span><span><i className="gray"/> Reservado</span></div></div>
    <div className="manager-two"><div className="card-surface"><SectionTitle kicker="RESUMO" title="Próximas reservas"/>{dayReservations.length?dayReservations.map((item)=><div className="manager-row" key={item.id}><b>{item.slots.join(" • ")}</b><span>{item.players} pessoas</span><strong>{money(item.total)}</strong></div>):<div className="manager-empty">Nenhuma reserva para este dia.</div>}</div><div className="card-surface"><SectionTitle kicker="AÇÃO RÁPIDA" title="Operação"/><button className="manager-action" onClick={()=>showToast("Check-in confirmado!")}><Check size={16}/><span>Confirmar check-in</span><ArrowRight size={14}/></button><button className="manager-action" onClick={()=>showToast("Financeiro pronto para exportar!")}><WalletCards size={16}/><span>Exportar financeiro</span><ArrowRight size={14}/></button><button className="manager-action" onClick={()=>showToast("Horários atualizados!")}><Clock3 size={16}/><span>Atualizar agenda</span><ArrowRight size={14}/></button></div></div>
  </section>;
}
