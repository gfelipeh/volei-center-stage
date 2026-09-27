import { ArrowRight,CalendarDays,Search,ShieldCheck,Sparkles,Ticket,Users } from "lucide-react";
import type { Category,Court } from "../../types/arena";
import { useArena } from "../shared/ArenaProvider";
import { SectionTitle } from "../shared/SectionTitle";
import { CategoryRail } from "../courts/CategoryRail";
import { DateRail } from "../courts/DateRail";
import { CourtCard } from "../courts/CourtCard";

export function HomeScreen({category,setCategory,day,setDay,setQuery,query,results,onSeeAll,onManager,openCourt}:{category:Category;setCategory:(v:Category)=>void;day:string;setDay:(v:string)=>void;query:string;setQuery:(v:string)=>void;results:Court[];onSeeAll:()=>void;onManager:()=>void;openCourt:(id:number)=>void}) {
  const {isFavorite,toggleFavorite}=useArena();
  return <>
    <section className="hero"><div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> RESERVE EM MINUTOS</span><h1>Encontre sua quadra<br/><em>e jogue hoje.</em></h1><p>Horários em tempo real, estrutura de verdade e um jeito simples de dividir a conta com a galera.</p>
      <div className="hero-search"><Search size={18}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Onde você quer jogar?"/><button onClick={onSeeAll}>Buscar</button></div>
      <div className="hero-trust"><span><ShieldCheck size={13}/> Pagamento seguro</span><span><ShieldCheck size={13}/> Cancelamento simples</span><span><ShieldCheck size={13}/> Avaliações reais</span></div>
    </div><div className="hero-art"><span className="hero-big">01</span><span className="volley-ball">●</span><div className="hero-note"><b>Seu jogo começa aqui.</b><span>Quadras selecionadas + horários livres.</span></div></div></section>
    <section className="content-section section-pad"><SectionTitle kicker="ESCOLHA SEU ESTILO" title="Qual é a sua vibe?"/><CategoryRail value={category} setValue={setCategory}/></section>
    <section className="content-section section-pad"><SectionTitle kicker="AGENDA" title="Quando você quer jogar?" action={<button className="icon-button soft"><CalendarDays size={19}/></button>}/><DateRail value={day} setValue={setDay}/></section>
    <section className="content-section section-pad"><SectionTitle kicker="PERTO DE VOCÊ" title="Quadras com vaga agora" action={<button className="text-button" onClick={onSeeAll}>Ver todas <ArrowRight size={15}/></button>}/>
      <div className="court-grid">{results.slice(0,3).map((court)=><CourtCard key={court.id} court={court} onClick={()=>openCourt(court.id)} isFavorite={isFavorite(court.id)} onFavorite={()=>toggleFavorite(court.id)}/>)}</div>
    </section>
    <section className="split-banner"><div><span className="eyebrow dark"><Users size={14}/> DIVISÃO DA GALERA</span><h2>Jogar em 10?<br/><em>Fica leve.</em></h2><p>Escolha quantas pessoas vão pagar e veja na hora quanto cada um fica.</p></div><div className="split-widget"><div className="split-top"><span>Reserva de R$ 170</span><b>TRANQUILO 😎</b></div><strong>R$ 17<small>/ pessoa</small></strong><div className="dots">{Array.from({length:10},(_,i)=><i key={i}>{i+1}</i>)}</div></div></section>
    <section className="content-section section-pad bottom-space"><SectionTitle kicker="COMO FUNCIONA" title="Reserve. Divida. Jogue."/><div className="how-grid">
      <div className="how"><span>01</span><i><Search size={19}/></i><h3>Ache sua quadra</h3><p>Compare preço, estrutura, nota e os próximos horários.</p></div>
      <div className="how"><span>02</span><i><Users size={19}/></i><h3>Monte a galera</h3><p>Defina o número de jogadores e divida tudo em segundos.</p></div>
      <div className="how"><span>03</span><i><Ticket size={19}/></i><h3>Entre e jogue</h3><p>Receba seu voucher digital e chegue com tudo pronto.</p></div>
    </div><button className="manager-link" onClick={onManager}>Sou gestor de arena <ArrowRight size={15}/></button></section>
  </>;
}
