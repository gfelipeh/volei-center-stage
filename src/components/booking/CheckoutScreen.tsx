import { useEffect,useMemo,useState } from "react";
import { ArrowRight,CalendarDays,Check,ChevronLeft,Clock3,CreditCard,Plus,ShieldCheck,Users,WalletCards,Zap } from "lucide-react";
import type { Court,PayMethod } from "../../types/arena";
import { extras,formatArenaDate,slotPrice } from "../../data/mockCourts";
import { useArena } from "../shared/ArenaProvider";
import { SectionTitle } from "../shared/SectionTitle";

const money=(v:number)=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const formatTime=(seconds:number)=>String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0");

export function CheckoutScreen({court,day,slots,players,payMethod,setPayMethod,onBack,onConfirm}:{court:Court;day:string;slots:string[];players:number;payMethod:PayMethod;setPayMethod:(v:PayMethod)=>void;onBack:()=>void;onConfirm:(total:number,extraIds:string[])=>void}) {
  const {showToast}=useArena();
  const [secondsLeft,setSecondsLeft]=useState(600);
  const [pickedExtras,setPickedExtras]=useState<string[]>([]);
  useEffect(()=>{setSecondsLeft(600);const timer=window.setInterval(()=>setSecondsLeft((value)=>Math.max(0,value-1)),1000);return()=>window.clearInterval(timer);},[]);
  const extraTotal=useMemo(()=>pickedExtras.reduce((sum,id)=>sum+(extras.find((item)=>item.id===id)?.price??0),0),[pickedExtras]);
  const courtTotal=slots.reduce((sum,slot)=>sum+slotPrice(court,slot),0);
  const total=courtTotal+extraTotal;
  const perPerson=players?total/players:0;
  const toggleExtra=(id:string)=>setPickedExtras((items)=>items.includes(id)?items.filter((item)=>item!==id):[...items,id]);
  const pixPayload="00020126580014BR.GOV.BCB.PIX0136arena-volei-demo-pagamento-2026";
  const copyPix=async()=>{try{await navigator.clipboard.writeText(pixPayload);showToast("Chave PIX copiada!");}catch{showToast("Não foi possível copiar automaticamente.");}};
  return <section className="content-section checkout page-space"><div className="checkout-head"><button className="back-link" onClick={onBack}><ChevronLeft size={18}/> Voltar</button><span><ShieldCheck size={15}/> Pagamento seguro</span></div>
    <div className="page-heading"><span className="section-kicker">QUASE LÁ</span><h1>Confirme seu jogo</h1><p>Seu horário fica reservado enquanto você finaliza.</p></div>
    <div className="checkout-grid"><div className="checkout-card booking-summary"><img src={court.image} alt={court.name}/><div><span className="detail-area">{court.area}</span><h2>{court.name}</h2><p><CalendarDays size={13}/> {formatArenaDate(day)} · <Clock3 size={13}/> {slots.join(" • ")}</p><p><Users size={13}/> {players} pessoas</p></div></div>
      <div className="checkout-card"><SectionTitle kicker="EXTRAS" title="Quer turbinar o jogo?"/>{extras.map((item)=><button key={item.id} className={"extra-row"+(pickedExtras.includes(item.id)?" active":"")} onClick={()=>toggleExtra(item.id)}><span className="extra-icon"><Zap/></span><span><b>{item.name}</b><small>{item.detail}</small></span><strong>+ {money(item.price)}</strong>{pickedExtras.includes(item.id)?<Check size={18}/>:<Plus size={18}/>}</button>)}</div>
      <div className="checkout-card"><SectionTitle kicker="PAGAMENTO" title="Como pagar?"/><div className="pay-tabs"><button className={payMethod==="pix"?"active":""} onClick={()=>setPayMethod("pix")}><Zap size={17}/> PIX</button><button className={payMethod==="card"?"active":""} onClick={()=>setPayMethod("card")}><CreditCard size={17}/> Cartão</button></div>
      {payMethod==="pix"?<div className="pix-box"><div className="timer"><Clock3 size={15}/> Pagamento disponível por <b>{formatTime(secondsLeft)}</b></div>{secondsLeft>0?<><div className="qr"><div/><span>QR CODE PIX</span></div><p>Escaneie ou copie o código no seu banco.</p><button className="copy-pix" onClick={copyPix}><WalletCards size={16}/> Copiar chave PIX</button><code className="pix-key">arena-volei-demo-pagamento</code></>:<div className="pix-expired"><Clock3 size={20}/><b>Tempo esgotado</b><span>Volte ao agendamento para gerar um novo pagamento.</span></div>}</div>:<div className="fields"><label>Nome no cartão<input placeholder="Seu nome"/></label><label>Número do cartão<input inputMode="numeric" placeholder="0000 0000 0000 0000"/></label><div><label>Validade<input placeholder="MM/AA"/></label><label>CVV<input inputMode="numeric" placeholder="000"/></label></div></div>}</div>
      <div className="checkout-card total-card"><div className="line"><span>Quadra ({slots.length}h)</span><b>{money(courtTotal)}</b></div><div className="line"><span>Extras</span><b>{money(extraTotal)}</b></div><div className="total-line"><span>Total</span><strong>{money(total)}</strong></div><p className="per-line"><Users size={14}/> {players} pessoas · {money(perPerson)} por pessoa</p><button className="primary full" disabled={secondsLeft===0} onClick={()=>onConfirm(total,pickedExtras)}>Confirmar reserva <ArrowRight size={18}/></button><small className="legal">Você concorda com as regras de cancelamento da arena.</small></div>
    </div>
  </section>;
}
