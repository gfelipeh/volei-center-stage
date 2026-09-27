import { Check,LockKeyhole } from "lucide-react";
import type { SlotStatus } from "../../types/arena";
const money=(value:number)=>value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
export function SlotButton({value,status,selected,price,onClick}:{value:string;status:SlotStatus;selected:boolean;price:number;onClick:()=>void}) {
  const disabled=status==="taken"||status==="blocked";
  return <button className={"slot "+status+(selected?" selected":"")} disabled={disabled} onClick={onClick}>
    <b>{value}</b><span>{status==="taken"?"Ocupado":status==="blocked"?"Bloqueado":money(price)}</span>
    {selected?<Check size={15}/>:status==="blocked"?<LockKeyhole size={13}/>:null}
  </button>;
}
