import { useMemo,useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { courts } from "../data/mockCourts";
import type { Category,PayMethod,Reservation,Screen } from "../types/arena";
import { useArena } from "../components/shared/ArenaProvider";
import { useScreenHistory } from "../hooks/useScreenHistory";
import { Header } from "../components/shared/Header";
import { BottomNav } from "../components/shared/BottomNav";
import { HomeScreen } from "../components/screens/HomeScreen";
import { SearchScreen } from "../components/screens/SearchScreen";
import { DetailScreen } from "../components/screens/DetailScreen";
import { CheckoutScreen } from "../components/booking/CheckoutScreen";
import { SuccessScreen } from "../components/screens/SuccessScreen";
import { ReservationsScreen } from "../components/screens/ReservationsScreen";
import { ProfileScreen } from "../components/screens/ProfileScreen";
import { ManagerScreen } from "../components/screens/ManagerScreen";

export const Route=createFileRoute("/")({component:ArenaVolei});

function ArenaVolei() {
  const {screen,navigate,back}=useScreenHistory("home");
  const {createReservation}=useArena();
  const [category,setCategory]=useState<Category>("Todos");
  const [query,setQuery]=useState("");
  const [court,setCourt]=useState(courts[0]!);
  const [day,setDay]=useState("27");
  const [slots,setSlots]=useState<string[]>(["18:00"]);
  const [players,setPlayers]=useState(10);
  const [payMethod,setPayMethod]=useState<PayMethod>("pix");
  const [lastReservation,setLastReservation]=useState<Reservation|null>(null);

  const results=useMemo(()=>courts.filter((item)=>{
    const q=query.trim().toLowerCase();
    return (category==="Todos"||item.area===category)&&(!q||(item.name+" "+item.neighborhood+" "+item.area).toLowerCase().includes(q));
  }),[category,query]);

  const openCourt=(id:number)=>{const next=courts.find((item)=>item.id===id)??courts[0]!;setCourt(next);setSlots(["18:00"]);setPlayers(10);navigate("detail");};
  const confirmBooking=(total:number)=>{const reservation=createReservation({court,day,slots,players,total});setLastReservation(reservation);navigate("success");};
  const handlePointerDown=(event:React.PointerEvent<HTMLDivElement>)=>{const target=event.target as Element;if(target.closest("button")&&"vibrate" in navigator) navigator.vibrate?.(7);};

  let content;
  switch(screen) {
    case "search": content=<SearchScreen category={category} setCategory={setCategory} results={results} query={query} setQuery={setQuery} openCourt={openCourt}/>; break;
    case "detail": content=<DetailScreen court={court} day={day} setDay={setDay} slots={slots} setSlots={setSlots} players={players} setPlayers={setPlayers} onBack={back} onCheckout={()=>navigate("checkout")}/>; break;
    case "checkout": content=<CheckoutScreen court={court} day={day} slots={slots} players={players} payMethod={payMethod} setPayMethod={setPayMethod} onBack={back} onConfirm={confirmBooking}/>; break;
    case "success": content=<SuccessScreen reservation={lastReservation} onHome={()=>navigate("home")} onReservations={()=>navigate("reservations")}/>; break;
    case "reservations": content=<ReservationsScreen onBook={()=>navigate("search")} onHome={()=>navigate("home")}/>; break;
    case "profile": content=<ProfileScreen onManager={()=>navigate("manager")} onReservations={()=>navigate("reservations")}/>; break;
    case "manager": content=<ManagerScreen onBack={back} onClientView={openCourt}/>; break;
    default: content=<HomeScreen category={category} setCategory={setCategory} day={day} setDay={setDay} query={query} setQuery={setQuery} results={results} openCourt={openCourt} onSeeAll={()=>navigate("search")} onManager={()=>navigate("manager")}/>;
  }

  return <div className="arena-app" onPointerDown={handlePointerDown}><Header onSearch={()=>navigate("search")} onProfile={()=>navigate("profile")} onHome={()=>navigate("home")}/><main><div key={screen} className="screen-stage">{content}</div></main>{["home","search","reservations","profile"].includes(screen)&&<BottomNav screen={screen} navigate={navigate}/>}</div>;
}
