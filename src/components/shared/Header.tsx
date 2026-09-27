import { Menu,Search,Zap } from "lucide-react";
export function Header({onSearch,onProfile,onHome}:{onSearch:()=>void;onProfile:()=>void;onHome:()=>void}) {
  return <header className="topbar"><div className="topbar-inner">
    <button className="brand" onClick={onHome} aria-label="Ir para início"><span className="brand-mark"><Zap size={18} fill="currentColor"/></span><span><b>Arena</b> Vôlei</span></button>
    <div className="header-actions"><button className="icon-button" onClick={onSearch} aria-label="Buscar"><Search size={20}/></button><button className="icon-button" onClick={onProfile} aria-label="Perfil"><Menu size={20}/></button></div>
  </div></header>;
}
