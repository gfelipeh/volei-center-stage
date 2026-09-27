import type { ArenaDate, Court, Extra, SlotGroup, SlotStatus } from "../types/arena";

export const courts: Court[] = [
  { id:1, name:"Arena Sol Nascente", area:"Areia", neighborhood:"Centro", distance:"1,8 km", rating:"4,9", reviews:186, price:85, status:"available", tags:["Coberta","Iluminação","Vestiário"], image:"https://images.unsplash.com/photo-1612872087720-bb876e2e67d3?auto=format&fit=crop&w=1400&q=88", description:"Quadra de areia premium, coberta e com iluminação para partidas durante todo o dia." },
  { id:2, name:"Vôlei na Orla", area:"Areia", neighborhood:"Nova Orla", distance:"4,2 km", rating:"4,8", reviews:122, price:70, status:"limited", tags:["Beira-rio","Chuveiro","Estacionamento"], image:"https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1400&q=88", description:"Clima de praia, areia fofa e estrutura completa para aquele jogo com a galera." },
  { id:3, name:"House Indoor", area:"Indoor", neighborhood:"Jardim América", distance:"5,7 km", rating:"4,7", reviews:98, price:110, status:"available", tags:["Piso vinílico","Ar-condicionado","Vestiário"], image:"https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1400&q=88", description:"Quadra indoor profissional para treinos, peladas e campeonatos em qualquer clima." },
  { id:4, name:"Sand Club 360", area:"Beach Tennis", neighborhood:"Aeroporto", distance:"7,1 km", rating:"4,8", reviews:77, price:65, status:"available", tags:["Areia premium","Som","Bar"], image:"https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1400&q=88", description:"Centro esportivo com areia premium, lounge e energia de club para jogar e ficar." },
];

export const extras: Extra[] = [
  { id:"ball", name:"Bolas oficiais", detail:"Kit com 2 bolas", price:18 },
  { id:"water", name:"Água gelada", detail:"8 garrafas", price:16 },
  { id:"light", name:"Iluminação extra", detail:"Mais 1 hora", price:25 },
];

export const slotGroups: SlotGroup[] = [
  { name:"Manhã", values:["07:00","08:00","09:00","10:00","11:00"] },
  { name:"Tarde", values:["14:00","15:00","16:00","17:00","18:00"] },
  { name:"Noite", values:["19:00","20:00","21:00","22:00"] },
];

export const dates: ArenaDate[] = [
  { label:"Hoje", day:"27", month:"SET" },
  { label:"Amanhã", day:"28", month:"SET" },
  { label:"Seg", day:"29", month:"SET" },
  { label:"Ter", day:"30", month:"SET" },
  { label:"Qua", day:"01", month:"OUT" },
];

export const slotState: Record<string, Exclude<SlotStatus,"blocked">> = {
  "07:00":"open","08:00":"open","09:00":"taken","10:00":"open","11:00":"open",
  "14:00":"open","15:00":"prime","16:00":"prime","17:00":"open","18:00":"open",
  "19:00":"taken","20:00":"open","21:00":"open","22:00":"open",
};

export const formatArenaDate = (day:string) => {
  const date = dates.find((item) => item.day === day);
  if (!date) return day;
  return date.day + " de " + (date.month === "SET" ? "setembro" : "outubro");
};

export const slotPrice = (court:Court, slot:string) => court.price + (slotState[slot] === "prime" ? 15 : 0);
