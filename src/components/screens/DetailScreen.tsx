import { ArrowRight,ChevronLeft,MapPin,Minus,Plus,ShieldCheck,Star } from "lucide-react";
import { useMemo } from "react";
import { formatArenaDate,slotGroups,slotPrice } from "../../data/mockCourts";
import type { Court,SlotStatus } from "../../types/arena";
import { useArena } from "../shared/ArenaProvider";
import { DateRail } from "../courts/DateRail";
import { SlotButton } from "../courts/SlotButton";
import { SectionTitle } from "../shared/SectionTitle";

const money=(v:number)=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

export function DetailScreen({court,day,setDay,slots,setSlots,players,setPlayers,onBack,onCheckout}:{court:Court;day:string;setDay:(v:string)=>void;slots:string[];setSlots:(v:string[])=>void;players:number;setPlayers:(v:number)=>void;onBack:()=>void;onCheckout:()=>void}) {
  const {getSlotStatus}=useArena();
  const statuses=useMemo<Record<string,SlotStatus>>(()=>Object.fromEntries(slotGroups.flatMap((group)=>group.values.map((slot)=>[slot,getSlotStatus(court.id,day,slot)]))) as Record<string,SlotStatus>,[court.id,day,getSlotStatus]);
  const total=slots.reduce((sum,slot)=>sum+slotPrice(court,slot),0);
  const perPerson=players?total/players:0;
  const invalidSelection=slots.some((slot)=>{const status=statuses[slot]??"open";return status==="taken"||status==="blocked";});
  const toggle=(slot:string)=>setSlots(slots.includes(slot)?slots.filter((item)=>item!==slot):[...slots,slot].sort());
  return <section className="detail"><div className="detail-cover"><img src={court.image} alt={court.name}/><button className="cover-button left" onClick={onBack} aria-label="Voltar"><ChevronLeft size={22}/></button><span className="cover-status"><i/> Vagas abertas hoje</span></div>
    <div className="content-section detail-panel"><span className="detail-area">{court.area} · {court.neighborhood}</span><div className="detail-head"><div><h1>{court.name}</h1><p><MapPin size={14}/> {court.distance} do centro · <Star size={13} fill="currentColor"/> {court.rating} ({court.reviews})</p></div></div><p className="description">{court.description}</p>
    <div className="amenities">{court.tags.map((tag)=><span key={tag}><ShieldCheck size={16}/> {tag}</span>)}</div><div className="detail-divider"/>
    <SectionTitle kicker="ESCOLHA O DIA" title="Horários disponíveis"/><DateRail value={day} setValue={(value)=>{setDay(value);setSlots([]);}}/><div className="detail-date-caption">{formatArenaDate(day)} · selecione uma ou mais horas</div>
    <div className="legend"><span><i className="green"/> Livre</span><span><i className="yellow"/> Premium</span><span><i className="gray"/> Ocupado</span><span><i className="blocked-legend"/> Bloqueado</span></div>
    {slotGroups.map((group)=><div className="slot-group" key={group.name}><h3>{group.name}</h3><div className="slot-grid">{group.values.map((slot)=><SlotButton key={slot} value={slot} status={statuses[slot]??"open"} selected={slots.includes(slot)} price={slotPrice(court,slot)} onClick={()=>toggle(slot)}/>)}</div></div>)}
    <div className="split-card"><div><span className="section-kicker">DIVISÃO DA GALERA</span><h3>Quantas pessoas vão pagar?</h3><p>O valor atualiza conforme os horários selecionados.</p></div><div className="stepper"><button onClick={()=>setPlayers(Math.max(2,players-1))} aria-label="Diminuir"><Minus size={17}/></button><b>{players}</b><button onClick={()=>setPlayers(Math.min(24,players+1))} aria-label="Aumentar"><Plus size={17}/></button></div><div className="per-person"><small>Por pessoa</small><strong>{money(perPerson)}</strong><span>Total {money(total)}</span></div></div></div>
    <div className="sticky-book"><div><small>{slots.length} {slots.length===1?"hora":"horas"}</small><strong>{money(total)}</strong></div><button disabled={!slots.length||invalidSelection} onClick={onCheckout}>{invalidSelection?"Atualize os horários":"Continuar"} <ArrowRight size={18}/></button></div>
  </section>;
}
