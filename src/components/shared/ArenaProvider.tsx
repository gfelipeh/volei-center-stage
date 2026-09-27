import { createContext,useCallback,useContext,useMemo,useRef,useState,type ReactNode } from "react";
import { courts,slotState } from "../../data/mockCourts";
import type { Reservation,SlotStatus } from "../../types/arena";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";

type ArenaContextValue = {
  reservations:Reservation[]; favorites:number[]; blockedSlots:Record<string,string[]>;
  toggleFavorite:(courtId:number)=>void; isFavorite:(courtId:number)=>boolean;
  toggleBlockedSlot:(courtId:number,day:string,slot:string)=>void; getSlotStatus:(courtId:number,day:string,slot:string)=>SlotStatus;
  createReservation:(reservation:Omit<Reservation,"id"|"createdAt">)=>Reservation; showToast:(message:string)=>void;
};
const demoReservations:Reservation[] = [{ id:"demo-1",court:courts[0]!,day:"27",slots:["20:00","21:00"],players:10,total:170,createdAt:"2026-09-27T12:00:00.000Z" }];
const ArenaContext = createContext<ArenaContextValue|null>(null);

export function ArenaProvider({children}:{children:ReactNode}) {
  const [reservations,setReservations] = useLocalStorageState<Reservation[]>("arena:reservations",demoReservations);
  const [favorites,setFavorites] = useLocalStorageState<number[]>("arena:favorites",[]);
  const [blockedSlots,setBlockedSlots] = useLocalStorageState<Record<string,string[]>>("arena:blocked-slots",{});
  const [toast,setToast] = useState<string|null>(null);
  const toastTimer = useRef<number|undefined>(undefined);
  const showToast = useCallback((message:string) => {
    setToast(message); window.clearTimeout(toastTimer.current); toastTimer.current = window.setTimeout(() => setToast(null),2200);
  },[]);
  const toggleFavorite = useCallback((courtId:number) => setFavorites((current) => current.includes(courtId) ? current.filter((id) => id !== courtId) : [...current,courtId]),[setFavorites]);
  const toggleBlockedSlot = useCallback((courtId:number,day:string,slot:string) => {
    const key = courtId + ":" + day;
    setBlockedSlots((current) => {
      const values = current[key] ?? [];
      const next = values.includes(slot) ? values.filter((item) => item !== slot) : [...values,slot];
      return {...current,[key]:next};
    });
  },[setBlockedSlots]);
  const getSlotStatus = useCallback((courtId:number,day:string,slot:string):SlotStatus => {
    const key = courtId + ":" + day;
    if ((blockedSlots[key] ?? []).includes(slot)) return "blocked";
    const reserved = reservations.some((item) => item.court.id === courtId && item.day === day && item.slots.includes(slot));
    if (reserved || slotState[slot] === "taken") return "taken";
    return slotState[slot] ?? "open";
  },[blockedSlots,reservations]);
  const createReservation = useCallback((input:Omit<Reservation,"id"|"createdAt">) => {
    const reservation = {...input,id:typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),createdAt:new Date().toISOString()};
    setReservations((current) => [reservation,...current]);
    return reservation;
  },[setReservations]);
  const value = useMemo(() => ({ reservations,favorites,blockedSlots,toggleFavorite,isFavorite:(id:number) => favorites.includes(id),toggleBlockedSlot,getSlotStatus,createReservation,showToast }),[reservations,favorites,blockedSlots,toggleFavorite,toggleBlockedSlot,getSlotStatus,createReservation,showToast]);
  return <ArenaContext.Provider value={value}>{children}{toast && <div className="arena-toast" role="status" aria-live="polite">{toast}</div>}</ArenaContext.Provider>;
}
export function useArena() { const context = useContext(ArenaContext); if (!context) throw new Error("useArena must be used inside ArenaProvider"); return context; }
