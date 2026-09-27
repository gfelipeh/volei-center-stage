import { useCallback,useEffect,useState } from "react";
import type { Screen } from "../types/arena";

export function useScreenHistory(initial:Screen) {
  const [screen,setScreen]=useState<Screen>(initial);
  useEffect(()=>{
    window.history.replaceState({arenaScreen:initial},"",window.location.href);
    const onPopState=(event:PopStateEvent)=>setScreen((event.state?.arenaScreen as Screen|undefined)??initial);
    window.addEventListener("popstate",onPopState);
    return ()=>window.removeEventListener("popstate",onPopState);
  },[initial]);
  const navigate=useCallback((next:Screen)=>{
    if(screen===next) return;
    window.history.pushState({arenaScreen:next},"",window.location.href);
    setScreen(next);
  },[screen]);
  const back=useCallback(()=>window.history.back(),[]);
  return {screen,navigate,back};
}
