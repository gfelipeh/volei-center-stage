import { ArrowRight,MapPin,Star } from "lucide-react";
import type { Court } from "../../types/arena";
const money=(value:number)=>value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
export function CourtCard({court,onClick,isFavorite,onFavorite,horizontal=false}:{court:Court;onClick:()=>void;isFavorite:boolean;onFavorite:()=>void;horizontal?:boolean}) {
  return <article className={horizontal?"court-card horizontal":"court-card"}>
    <button className="court-photo" onClick={onClick}><img src={court.image} alt={court.name}/><span className="status"><i/>{court.status==="available"?"Disponível":"Últimas vagas"}</span><span className="area">{court.area}</span></button>
    <button className={"heart"+(isFavorite?" favorite":"")} onClick={(event)=>{event.stopPropagation();onFavorite();}} aria-label={isFavorite?"Remover dos favoritos":"Adicionar aos favoritos"}>{isFavorite?"♥":"♡"}</button>
    <div className="court-info"><button className="plain-left" onClick={onClick}><h3>{court.name}</h3><p><MapPin size={14}/> {court.neighborhood} · {court.distance}</p></button>
      <div className="rating"><span><Star size={13} fill="currentColor"/> {court.rating}</span> · {court.reviews} avaliações</div>
      <div className="tag-row">{court.tags.slice(0,2).map((tag)=><small key={tag}>{tag}</small>)}</div>
      <div className="court-bottom"><div><small>a partir de</small><strong>{money(court.price)}</strong><span>/ hora</span></div><button className="mini-button" onClick={onClick}>Ver horários <ArrowRight size={14}/></button></div>
    </div>
  </article>;
}
