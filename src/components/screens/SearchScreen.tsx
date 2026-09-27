import { ChevronRight,Search } from "lucide-react";
import { useArena } from "../shared/ArenaProvider";
import { CategoryRail } from "../courts/CategoryRail";
import { CourtCard } from "../courts/CourtCard";
import type { Category } from "../../types/arena";
import { SectionTitle } from "../shared/SectionTitle";

export function SearchScreen({category,setCategory,results,query,setQuery,openCourt}:{category:Category;setCategory:(v:Category)=>void;results:typeof import("../../data/mockCourts").courts;query:string;setQuery:(v:string)=>void;openCourt:(id:number)=>void}) {
  const {isFavorite,toggleFavorite}=useArena();
  return <section className="content-section section-pad page-space"><div className="page-heading"><span className="section-kicker">EXPLORAR</span><h1>Encontre sua quadra</h1><p>Filtre por modalidade ou busque pelo bairro.</p></div>
    <div className="search-box"><Search size={19}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Quadra, bairro, modalidade..."/></div><CategoryRail value={category} setValue={setCategory}/><div className="result-meta"><span>{results.length} opções encontradas</span><button className="ghost-pill">Distância <ChevronRight size={14}/></button></div>
    <div className="court-list">{results.map((court)=><CourtCard key={court.id} court={court} horizontal onClick={()=>openCourt(court.id)} isFavorite={isFavorite(court.id)} onFavorite={()=>toggleFavorite(court.id)}/>)}</div>
    {!results.length && <div className="empty"><Search size={25}/><h3>Nada por aqui ainda</h3><p>Tente outra modalidade ou outro bairro.</p></div>}
    <div className="search-tip"><SectionTitle kicker="DICA" title="Salve suas favoritas"/><p>Toque no coração de uma quadra para encontrá-la depois, mesmo após fechar e abrir o navegador.</p></div>
  </section>;
}
