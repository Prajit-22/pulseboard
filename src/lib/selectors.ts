import type { Item } from './types';
export function visibleItems(items: Item[], section: string, query: string, favorites: string[], order: string[]): Item[] {
 const q=query.trim().toLocaleLowerCase();
 let result=items.filter(i=>(section!=='favorites'||favorites.includes(i.id)) && (!q || `${i.title} ${i.description} ${i.category} ${i.source}`.toLocaleLowerCase().includes(q)));
 if(section==='trending') return result.sort((a,b)=>b.score-a.score);
 const rank=new Map(order.map((id,i)=>[id,i]));
 return result.sort((a,b)=>(rank.get(a.id)??Number.MAX_SAFE_INTEGER)-(rank.get(b.id)??Number.MAX_SAFE_INTEGER));
}
export function mergePageOrder(existing: string[], page: string[], reordered: string[]): string[] {
 const ids=new Set(page); let index=0;
 return existing.map(id=>ids.has(id)?reordered[index++]!:id);
}
