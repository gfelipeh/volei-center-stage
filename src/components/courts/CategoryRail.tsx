import type { Category } from "../../types/arena";
export function CategoryRail({value,setValue}:{value:Category;setValue:(value:Category)=>void}) {
  return <div className="category-rail">{(["Todos","Areia","Indoor","Beach Tennis"] as Category[]).map((item)=><button key={item} className={value===item?"active":""} onClick={()=>setValue(item)}>{item==="Areia"?"Vôlei de areia":item}</button>)}</div>;
}
