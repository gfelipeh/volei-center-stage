import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, Clock3,
  CreditCard, Dumbbell, Home, MapPin, Menu, MessageCircle, Minus, Navigation,
  Plus, Search, ShieldCheck, Sparkles, Star, Ticket, UserRound, Users, WalletCards,
  X, Zap
} from "lucide-react";

export const Route = createFileRoute("/")({ component: ArenaVolei });

type Screen = "home" | "search" | "reservations" | "profile" | "manager" | "detail" | "checkout" | "success";
type Category = "Todos" | "Areia" | "Indoor" | "Beach Tennis";
type Court = {
  id: number; name: string; area: Category; neighborhood: string; distance: string;
  rating: string; reviews: number; price: number; status: "available" | "limited";
  tags: string[]; image: string; description: string;
};
type Reservation = { id: number; court: Court; slots: string[]; total: number };

const courts: Court[] = [
  { id: 1, name: "Arena Sol Nascente", area: "Areia", neighborhood: "Centro", distance: "1,8 km", rating: "4,9", reviews: 186, price: 85, status: "available", tags: ["Coberta", "Iluminação", "Vestiário"], image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d3?auto=format&fit=crop&w=1400&q=88", description: "Quadra de areia premium, coberta e com iluminação para partidas durante todo o dia." },
  { id: 2, name: "Vôlei na Orla", area: "Areia", neighborhood: "Nova Orla", distance: "4,2 km", rating: "4,8", reviews: 122, price: 70, status: "limited", tags: ["Beira-rio", "Chuveiro", "Estacionamento"], image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=88", description: "Clima de praia, areia fofa e estrutura completa para aquele jogo com a galera." },
  { id: 3, name: "House Indoor", area: "Indoor", neighborhood: "Jardim América", distance: "5,7 km", rating: "4,7", reviews: 98, price: 110, status: "available", tags: ["Piso vinílico", "Ar-condicionado", "Vestiário"], image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1400&q=88", description: "Quadra indoor profissional para treinos, peladas e campeonatos em qualquer clima." },
  { id: 4, name: "Sand Club 360", area: "Beach Tennis", neighborhood: "Aeroporto", distance: "7,1 km", rating: "4,8", reviews: 77, price: 65, status: "available", tags: ["Areia premium", "Som", "Bar"], image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1400&q=88", description: "Centro esportivo com areia premium, lounge e energia de club para jogar e ficar." },
];

const extras = [
  { id: "ball", name: "Bolas oficiais", detail: "Kit com 2 bolas", price: 18, icon: TrophyIcon },
  { id: "water", name: "Água gelada", detail: "8 garrafas", price: 16, icon: Dumbbell },
  { id: "light", name: "Iluminação extra", detail: "Mais 1 hora", price: 25, icon: Zap },
];

const slotGroups = [
  { name: "Manhã", values: ["07:00", "08:00", "09:00", "10:00", "11:00"] },
  { name: "Tarde", values: ["14:00", "15:00", "16:00", "17:00", "18:00"] },
  { name: "Noite", values: ["19:00", "20:00", "21:00", "22:00"] },
];

const slotState: Record<string, "open" | "prime" | "taken"> = {
  "07:00": "open", "08:00": "open", "09:00": "taken", "10:00": "open", "11:00": "open",
  "14:00": "open", "15:00": "prime", "16:00": "prime", "17:00": "open", "18:00": "prime",
  "19:00": "taken", "20:00": "open", "21:00": "open", "22:00": "open",
};

const dates = [
  { label: "Hoje", day: "27", month: "SET" },
  { label: "Amanhã", day: "28", month: "SET" },
  { label: "Seg", day: "29", month: "SET" },
  { label: "Ter", day: "30", month: "SET" },
  { label: "Qua", day: "01", month: "OUT" },
];

function TrophyIcon({ size = 18 }: { size?: number }) {
  return <span className="trophy-icon" style={{ fontSize: size }}>★</span>;
}
function money(value: number) { return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

function ArenaVolei() {
  const [screen, setScreen] = useState<Screen>("home");
  const [category, setCategory] = useState<Category>("Todos");
  const [query, setQuery] = useState("");
  const [court, setCourt] = useState<Court>(courts[0]);
  const [day, setDay] = useState("27");
  const [slots, setSlots] = useState<string[]>(["18:00"]);
  const [players, setPlayers] = useState(10);
  const [payMethod, setPayMethod] = useState<"pix" | "card">("pix");
  const [pickedExtras, setPickedExtras] = useState<string[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 1, court: courts[0], slots: ["18:00", "19:00"], total: 170 },
  ]);
  const [searchOpen, setSearchOpen] = useState(false);

  const results = useMemo(() => courts.filter(c => {
    const q = query.trim().toLowerCase();
    return (category === "Todos" || c.area === category) &&
      (!q || (c.name + " " + c.neighborhood + " " + c.area).toLowerCase().includes(q));
  }), [category, query]);

  const extraTotal = pickedExtras.reduce((sum, id) => sum + (extras.find(e => e.id === id)?.price || 0), 0);
  const total = slots.length * court.price + extraTotal;
  const perPerson = total / players;

  function openCourt(next: Court) {
    setCourt(next);
    setScreen("detail");
  }
  function toggleSlot(value: string) {
    if (slotState[value] === "taken") return;
    setSlots(current => current.includes(value) ? current.filter(v => v !== value) : current.concat(value).sort());
  }
  function toggleExtra(id: string) {
    setPickedExtras(current => current.includes(id) ? current.filter(v => v !== id) : current.concat(id));
  }
  function finishBooking() {
    setReservations(current => [{ id: Date.now(), court, slots: slots.slice(), total }, ...current]);
    setScreen("success");
  }

  return <div className="arena-app">
    <Header onSearch={() => setSearchOpen(true)} onMenu={() => setScreen("profile")} />
    {searchOpen && <div className="search-overlay"><div className="content-section search-overlay-inner">
      <div className="search-box"><Search size={19} /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Quadra, bairro ou modalidade" /><button onClick={() => setSearchOpen(false)}><X size={18} /></button></div>
      <button className="text-button" onClick={() => { setSearchOpen(false); setScreen("search"); }}>Abrir busca completa <ArrowRight size={16} /></button>
    </div></div>}

    <main>
      {screen === "home" && <HomeScreen {...{ category, setCategory, day, setDay, results, openCourt, query, setQuery }} onSeeAll={() => setScreen("search")} onManager={() => setScreen("manager")} />}
      {screen === "search" && <SearchScreen {...{ category, setCategory, results, query, setQuery, openCourt }} />}
      {screen === "detail" && <DetailScreen court={court} day={day} setDay={setDay} slots={slots} toggleSlot={toggleSlot} players={players} setPlayers={setPlayers} total={total} perPerson={perPerson} onBack={() => setScreen("home")} onCheckout={() => setScreen("checkout")} />}
      {screen === "checkout" && <CheckoutScreen court={court} slots={slots} players={players} total={total} perPerson={perPerson} payMethod={payMethod} setPayMethod={setPayMethod} extras={pickedExtras} toggleExtra={toggleExtra} extraTotal={extraTotal} onBack={() => setScreen("detail")} onConfirm={finishBooking} />}
      {screen === "success" && <SuccessScreen court={court} slots={slots} total={total} onHome={() => setScreen("home")} onReservations={() => setScreen("reservations")} />}
      {screen === "reservations" && <ReservationsScreen reservations={reservations} onBook={() => setScreen("search")} onHome={() => setScreen("home")} />}
      {screen === "profile" && <ProfileScreen onManager={() => setScreen("manager")} />}
      {screen === "manager" && <ManagerScreen onBack={() => setScreen("home")} />}
    </main>

    {!searchOpen && ["home", "search", "reservations", "profile"].includes(screen) && <BottomNav screen={screen} navigate={setScreen} />}
  </div>;
}

function Header({ onSearch, onMenu }: { onSearch: () => void; onMenu: () => void }) {
  return <header className="topbar"><div className="topbar-inner">
    <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><span className="brand-mark"><Zap size={17} fill="currentColor" /></span><span><b>Arena</b> Vôlei</span></button>
    <div className="header-actions"><button className="icon-button" onClick={onSearch}><Search size={19} /></button><button className="icon-button" onClick={onMenu}><Menu size={19} /></button></div>
  </div></header>;
}

function HomeScreen(p: {
  category: Category; setCategory: (v: Category) => void; day: string; setDay: (v: string) => void;
  results: Court[]; openCourt: (c: Court) => void; query: string; setQuery: (v: string) => void;
  onSeeAll: () => void; onManager: () => void;
}) {
  return <>
    <section className="hero"><div className="hero-copy">
      <span className="eyebrow"><Sparkles size={14} /> RESERVE EM MINUTOS</span>
      <h1>Encontre sua quadra<br /><em>e jogue hoje.</em></h1>
      <p>Horários em tempo real, estrutura de verdade e um jeito simples de dividir a conta com a galera.</p>
      <div className="hero-search"><Search size={18} /><input value={p.query} onChange={e => p.setQuery(e.target.value)} placeholder="Onde você quer jogar?" /><button onClick={p.onSeeAll}>Buscar</button></div>
      <div className="hero-trust"><span><ShieldCheck size={13} /> Pagamento seguro</span><span><ShieldCheck size={13} /> Cancelamento simples</span><span><ShieldCheck size={13} /> Avaliações reais</span></div>
    </div><div className="hero-art"><span className="hero-big">01</span><span className="volley-ball">●</span><div className="hero-note"><b>Seu jogo começa aqui.</b><span>Quadras selecionadas + horários livres.</span></div></div></section>

    <section className="content-section section-pad"><SectionTitle kicker="ESCOLHA SEU ESTILO" title="Qual é a sua vibe?" /><CategoryRail value={p.category} setValue={p.setCategory} /></section>
    <section className="content-section section-pad"><SectionTitle kicker="AGENDA" title="Quando você quer jogar?" action={<button className="icon-button soft"><CalendarDays size={18} /></button>} /><DateRail value={p.day} setValue={p.setDay} /></section>

    <section className="content-section section-pad"><SectionTitle kicker="PERTO DE VOCÊ" title="Quadras com vaga agora" action={<button className="text-button" onClick={p.onSeeAll}>Ver todas <ArrowRight size={15} /></button>} />
      <div className="court-grid">{p.results.slice(0, 3).map(c => <CourtCard key={c.id} court={c} onClick={() => p.openCourt(c)} />)}</div>
    </section>

    <section className="split-banner"><div><span className="eyebrow dark"><Users size={14} /> DIVISÃO DA GALERA</span><h2>Jogar em 10?<br /><em>Fica leve.</em></h2><p>Escolha quantas pessoas vão pagar e veja na hora quanto cada um fica.</p></div><div className="split-widget"><div className="split-top"><span>Reserva de R$ 170</span><b>TRANQUILO 😎</b></div><strong>R$ 17<small>/ pessoa</small></strong><div className="dots">{Array.from({ length: 10 }, (_, i) => <i key={i}>{i + 1}</i>)}</div></div></section>

    <section className="content-section section-pad bottom-space"><SectionTitle kicker="COMO FUNCIONA" title="Reserve. Divida. Jogue." /><div className="how-grid">
      <How n="01" icon={<Search size={19} />} title="Ache sua quadra" text="Compare preço, estrutura, nota e os próximos horários." />
      <How n="02" icon={<Users size={19} />} title="Monte a galera" text="Defina o número de jogadores e divida tudo em segundos." />
      <How n="03" icon={<Ticket size={19} />} title="Entre e jogue" text="Receba seu voucher digital e chegue com tudo pronto." />
    </div><button className="manager-link" onClick={p.onManager}>Sou gestor de arena <ArrowRight size={15} /></button></section>
  </>;
}

function SearchScreen(p: { category: Category; setCategory: (v: Category) => void; results: Court[]; query: string; setQuery: (v: string) => void; openCourt: (c: Court) => void; }) {
  return <section className="content-section section-pad page-space"><div className="page-heading"><span className="section-kicker">EXPLORAR</span><h1>Encontre sua quadra</h1><p>Filtre por modalidade ou busque pelo bairro.</p></div><div className="search-box"><Search size={19} /><input value={p.query} onChange={e => p.setQuery(e.target.value)} placeholder="Quadra, bairro, modalidade..." /></div><CategoryRail value={p.category} setValue={p.setCategory} /><div className="result-meta"><span>{p.results.length} opções encontradas</span><button className="ghost-pill">Distância <ChevronRight size={14} /></button></div><div className="court-list">{p.results.map(c => <CourtCard key={c.id} court={c} horizontal onClick={() => p.openCourt(c)} />)}</div>{!p.results.length && <EmptyState />}</section>;
}

function CategoryRail({ value, setValue }: { value: Category; setValue: (v: Category) => void }) {
  return <div className="category-rail">{(["Todos", "Areia", "Indoor", "Beach Tennis"] as Category[]).map(item => <button key={item} className={value === item ? "active" : ""} onClick={() => setValue(item)}>{item === "Areia" ? "Vôlei de areia" : item}</button>)}</div>;
}

function DateRail({ value, setValue }: { value: string; setValue: (v: string) => void }) {
  return <div className="date-rail">{dates.map(d => <button key={d.day} className={value === d.day ? "active" : ""} onClick={() => setValue(d.day)}><span>{d.label}</span><b>{d.day}</b><small>{d.month}</small></button>)}<button className="date-more"><CalendarDays size={16} /> Mais dias</button></div>;
}

function SectionTitle({ kicker, title, action }: { kicker: string; title: string; action?: ReactNode }) {
  return <div className="section-title"><div><span className="section-kicker">{kicker}</span><h2>{title}</h2></div>{action}</div>;
}

function CourtCard({ court, onClick, horizontal = false }: { court: Court; onClick: () => void; horizontal?: boolean }) {
  return <article className={horizontal ? "court-card horizontal" : "court-card"}>
    <button className="court-photo" onClick={onClick}><img src={court.image} alt="" /><span className="status"><i />{court.status === "available" ? "Disponível" : "Últimas vagas"}</span><span className="area">{court.area}</span><span className="heart">♡</span></button>
    <div className="court-info"><button className="plain-left" onClick={onClick}><h3>{court.name}</h3><p><MapPin size={13} /> {court.neighborhood} · {court.distance}</p></button><div className="rating"><span><Star size={13} fill="currentColor" /> {court.rating}</span> · {court.reviews} avaliações</div><div className="tag-row">{court.tags.slice(0, 2).map(t => <small key={t}>{t}</small>)}</div><div className="court-bottom"><div><small>a partir de</small><strong>{money(court.price)}</strong><span>/ hora</span></div><button className="mini-button" onClick={onClick}>Ver horários <ArrowRight size={14} /></button></div></div>
  </article>;
}

function DetailScreen(p: {
  court: Court; day: string; setDay: (v: string) => void; slots: string[]; toggleSlot: (v: string) => void;
  players: number; setPlayers: (n: number) => void; total: number; perPerson: number; onBack: () => void; onCheckout: () => void;
}) {
  return <section className="detail"><div className="detail-cover"><img src={p.court.image} alt="" /><button className="cover-button left" onClick={p.onBack}><ChevronLeft size={20} /></button><button className="cover-button right"><ArrowRight size={18} /></button><span className="cover-status"><i /> Vagas abertas hoje</span></div><div className="content-section detail-panel"><span className="detail-area">{p.court.area} · {p.court.neighborhood}</span><div className="detail-head"><div><h1>{p.court.name}</h1><p><MapPin size={14} /> {p.court.distance} do centro · <Star size={13} fill="currentColor" /> {p.court.rating} ({p.court.reviews})</p></div><button className="favorite-large">♡</button></div><p className="description">{p.court.description}</p><div className="amenities">{p.court.tags.map(t => <span key={t}><ShieldCheck size={16} /> {t}</span>)}</div><div className="detail-divider" /><SectionTitle kicker="ESCOLHA O DIA" title="Horários disponíveis" /><DateRail value={p.day} setValue={p.setDay} /><div className="legend"><span><i className="green" /> Livre</span><span><i className="yellow" /> Premium</span><span><i className="gray" /> Ocupado</span></div>{slotGroups.map(g => <div className="slot-group" key={g.name}><h3>{g.name}</h3><div className="slot-grid">{g.values.map(s => <Slot key={s} value={s} state={slotState[s]} selected={p.slots.includes(s)} onClick={() => p.toggleSlot(s)} price={p.court.price} />)}</div></div>)}<div className="split-card"><div><span className="section-kicker">DIVISÃO DA GALERA</span><h3>Quantas pessoas vão pagar?</h3><p>O valor atualiza conforme os horários selecionados.</p></div><div className="stepper"><button onClick={() => p.setPlayers(Math.max(2, p.players - 1))}><Minus size={15} /></button><b>{p.players}</b><button onClick={() => p.setPlayers(Math.min(24, p.players + 1))}><Plus size={15} /></button></div><div className="per-person"><small>Por pessoa</small><strong>{money(p.perPerson)}</strong><span>Total {money(p.total)}</span></div></div></div><div className="sticky-book"><div><small>{p.slots.length} {p.slots.length === 1 ? "hora" : "horas"}</small><strong>{money(p.total)}</strong></div><button disabled={!p.slots.length} onClick={p.onCheckout}>Continuar <ArrowRight size={17} /></button></div></section>;
}

function Slot({ value, state, selected, onClick, price }: { value: string; state: "open" | "prime" | "taken"; selected: boolean; onClick: () => void; price: number; }) {
  const unavailable = state === "taken";
  return <button disabled={unavailable} onClick={onClick} className={"slot " + state + (selected ? " selected" : "")}><b>{value}</b><span>{unavailable ? "Ocupado" : money(price + (state === "prime" ? 15 : 0))}</span>{selected && <Check size={14} />}</button>;
}

function CheckoutScreen(p: { court: Court; slots: string[]; players: number; total: number; perPerson: number; payMethod: "pix" | "card"; setPayMethod: (v: "pix" | "card") => void; extras: string[]; toggleExtra: (id: string) => void; extraTotal: number; onBack: () => void; onConfirm: () => void; }) {
  return <section className="content-section checkout page-space"><div className="checkout-head"><button className="back-link" onClick={p.onBack}><ChevronLeft size={17} /> Voltar</button><span><ShieldCheck size={15} /> Pagamento seguro</span></div><div className="page-heading"><span className="section-kicker">QUASE LÁ</span><h1>Confirme seu jogo</h1><p>Seu horário fica reservado enquanto você finaliza.</p></div><div className="checkout-grid"><div className="checkout-card booking-summary"><img src={p.court.image} alt="" /><div><span className="detail-area">{p.court.area}</span><h2>{p.court.name}</h2><p><CalendarDays size={13} /> 27 de setembro · <Clock3 size={13} /> {p.slots.join(" • ")}</p><p><Users size={13} /> {p.players} pessoas</p></div></div><div className="checkout-card"><SectionTitle kicker="EXTRAS" title="Quer turbinar o jogo?" />{extras.map(x => { const Icon = x.icon; const active = p.extras.includes(x.id); return <button key={x.id} onClick={() => p.toggleExtra(x.id)} className={"extra-row" + (active ? " active" : "")}><span className="extra-icon"><Icon /></span><span><b>{x.name}</b><small>{x.detail}</small></span><strong>+ {money(x.price)}</strong>{active ? <Check size={17} /> : <Plus size={17} />}</button>; })}</div><div className="checkout-card"><SectionTitle kicker="PAGAMENTO" title="Como pagar?" /><div className="pay-tabs"><button className={p.payMethod === "pix" ? "active" : ""} onClick={() => p.setPayMethod("pix")}><Zap size={16} /> PIX</button><button className={p.payMethod === "card" ? "active" : ""} onClick={() => p.setPayMethod("card")}><CreditCard size={16} /> Cartão</button></div>{p.payMethod === "pix" ? <div className="pix-box"><div className="timer"><Clock3 size={15} /> Pagamento disponível por <b>09:59</b></div><div className="qr"><div /><span>QR CODE PIX</span></div><p>Escaneie ou copie o código no seu banco.</p></div> : <div className="fields"><label>Nome no cartão<input placeholder="Seu nome" /></label><label>Número do cartão<input placeholder="0000 0000 0000 0000" /></label><div><label>Validade<input placeholder="MM/AA" /></label><label>CVV<input placeholder="000" /></label></div></div>}</div><div className="checkout-card total-card"><div className="line"><span>Quadra ({p.slots.length}h)</span><b>{money(p.slots.length * p.court.price)}</b></div><div className="line"><span>Extras</span><b>{money(p.extraTotal)}</b></div><div className="total-line"><span>Total</span><strong>{money(p.total)}</strong></div><p className="per-line"><Users size={14} /> {p.players} pessoas · {money(p.perPerson)} por pessoa</p><button className="primary full" onClick={p.onConfirm}>Confirmar reserva <ArrowRight size={17} /></button><small className="legal">Você concorda com as regras de cancelamento da arena.</small></div></div></section>;
}

function SuccessScreen(p: { court: Court; slots: string[]; total: number; onHome: () => void; onReservations: () => void; }) {
  return <section className="success"><div className="success-icon"><Check size={39} strokeWidth={3} /></div><span className="eyebrow">RESERVA CONFIRMADA</span><h1>Partiu jogo! 🏐</h1><p>Seu horário está garantido. Salve o voucher e compartilhe com a galera.</p><div className="voucher"><div className="voucher-top"><div><span>ARENA VÔLEI</span><b>{p.court.name}</b></div><Ticket size={23} /></div><div className="voucher-data"><div><small>DATA</small><b>27 SET</b></div><div><small>HORÁRIO</small><b>{p.slots.join(" • ")}</b></div><div><small>TOTAL</small><b>{money(p.total)}</b></div></div><div className="voucher-actions"><span>#AV-2026-0927</span><button><MessageCircle size={14} /> WhatsApp</button><button><Navigation size={14} /> Waze</button></div></div><div className="success-actions"><button className="primary full" onClick={p.onReservations}>Ver minhas reservas <Ticket size={17} /></button><button className="secondary full" onClick={p.onHome}>Voltar para início</button></div></section>;
}

function ReservationsScreen(p: { reservations: Reservation[]; onHome: () => void; onBook: () => void; }) {
  return <section className="content-section page-space"><div className="page-heading"><span className="section-kicker">SEUS JOGOS</span><h1>Minhas reservas</h1><p>Próximos jogos e vouchers na palma da mão.</p></div><div className="tabs"><button className="active">Próximas <b>{p.reservations.length}</b></button><button>Histórico</button></div><div className="reservation-list">{p.reservations.map(r => <article className="reservation-card" key={r.id}><div className="reservation-photo"><img src={r.court.image} alt="" /><span>CONFIRMADA</span></div><div className="reservation-info"><div className="reservation-top"><div><span>{r.court.area}</span><h2>{r.court.name}</h2></div><strong>{money(r.total)}</strong></div><p><CalendarDays size={14} /> 27 de setembro de 2026</p><p><Clock3 size={14} /> {r.slots.join(" • ")} · {r.slots.length}h</p><div className="reservation-actions"><button><Navigation size={14} /> Como chegar</button><button><Ticket size={14} /> Voucher</button></div></div></article>)}</div><button className="secondary full" onClick={p.onBook}><Plus size={17} /> Fazer nova reserva</button><button className="under-action" onClick={p.onHome}><ArrowLeft size={14} /> Voltar para início</button></section>;
}

function ProfileScreen({ onManager }: { onManager: () => void }) {
  return <section className="content-section page-space"><div className="profile-head"><div className="avatar">JC</div><div><span className="section-kicker">JOGADOR</span><h1>João Campos</h1><p>12 reservas · membro desde 2026</p></div><button className="icon-button"><Menu size={18} /></button></div><div className="profile-grid"><ProfileItem icon={<Ticket />} title="Minhas reservas" detail="Próximo jogo hoje, 18:00" /><ProfileItem icon={<Star />} title="Favoritos" detail="4 quadras salvas" /><ProfileItem icon={<WalletCards />} title="Pagamentos" detail="PIX e cartões" /><ProfileItem icon={<ShieldCheck />} title="Segurança" detail="Conta protegida" /></div><div className="profile-callout"><span className="eyebrow dark">ARENA PARA GESTORES</span><h2>Quer colocar sua quadra aqui?</h2><p>Organize horários, ocupação, check-in e faturamento em um só lugar.</p><button className="primary" onClick={onManager}>Conhecer painel</button></div></section>;
}

function ProfileItem({ icon, title, detail }: { icon: ReactNode; title: string; detail: string }) {
  return <div className="profile-item"><span>{icon}</span><div><b>{title}</b><small>{detail}</small></div><ChevronRight size={16} /></div>;
}

function ManagerScreen({ onBack }: { onBack: () => void }) {
  const bars = [43, 62, 57, 74, 91, 71, 86];
  return <section className="content-section page-space manager"><div className="manager-head"><button className="back-link" onClick={onBack}><ChevronLeft size={17} /> App</button><div><span className="section-kicker">PAINEL DO GESTOR</span><h1>Arena Sol Nascente</h1></div><span className="operating"><i /> Operando</span></div><div className="kpi-grid"><Kpi label="Ocupação hoje" value="78%" change="+12%" icon={<Zap />} /><Kpi label="Faturamento" value="R$ 1.840" change="+8,4%" icon={<WalletCards />} /><Kpi label="Reservas" value="22" change="+4 hoje" icon={<Ticket />} /></div><div className="card-surface chart"><SectionTitle kicker="ÚLTIMOS 7 DIAS" title="Ocupação por dia" /><div className="bars">{bars.map((v, i) => <div key={i}><span style={{ height: v + "%" }} /><small>{["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"][i]}</small></div>)}</div></div><div className="manager-two"><div className="card-surface"><SectionTitle kicker="HOJE" title="Próximos jogos" />{["18:00", "19:00", "20:00"].map((t, i) => <div className="manager-row" key={t}><b>{t}</b><span>{i === 1 ? "Beach Tennis • 4 pessoas" : "Vôlei • " + (i === 0 ? "8" : "10") + " pessoas"}</span><strong>{money(i === 1 ? 65 : 85)}</strong></div>)}</div><div className="card-surface"><SectionTitle kicker="AÇÃO RÁPIDA" title="Operação" />{["Bloquear horário", "Confirmar check-in", "Exportar financeiro"].map((t, i) => <button className="manager-action" key={t}>{[Clock3, Check, WalletCards][i] && (() => { const I = [Clock3, Check, WalletCards][i]; return <I size={16} />; })()}<span>{t}</span><ArrowRight size={14} /></button>)}</div></div></section>;
}

function Kpi({ label, value, change, icon }: { label: string; value: string; change: string; icon: ReactNode }) {
  return <div className="kpi"><span>{icon}</span><small>{label}</small><strong>{value}</strong><em>{change}</em></div>;
}

function How({ n, icon, title, text }: { n: string; icon: ReactNode; title: string; text: string }) {
  return <div className="how"><span>{n}</span><i>{icon}</i><h3>{title}</h3><p>{text}</p></div>;
}
function EmptyState() { return <div className="empty"><Dumbbell size={24} /><h3>Nada por aqui ainda</h3><p>Tente outra modalidade ou outro bairro.</p></div>; }

function BottomNav({ screen, navigate }: { screen: Screen; navigate: (v: Screen) => void }) {
  const items: { id: Screen; label: string; icon: ReactNode }[] = [
    { id: "home", label: "Início", icon: <Home size={19} /> },
    { id: "search", label: "Buscar", icon: <Search size={19} /> },
    { id: "reservations", label: "Reservas", icon: <Ticket size={19} /> },
    { id: "profile", label: "Perfil", icon: <UserRound size={19} /> },
  ];
  return <nav className="bottom-nav">{items.map(item => <button key={item.id} className={screen === item.id ? "active" : ""} onClick={() => navigate(item.id)}>{item.icon}<span>{item.label}</span></button>)}</nav>;
}
