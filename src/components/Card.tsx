'use client';
import { Heart, ArrowUpRight, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { Reorder, useDragControls } from 'framer-motion';
import type { Item } from '@/lib/types';
export default function Card({item,favorite,onFavorite,onMove,index,count,reorder}:{item:Item;favorite:boolean;onFavorite:()=>void;onMove:(direction:number)=>void;index:number;count:number;reorder:boolean}){
 const controls=useDragControls();
 return <Reorder.Item value={item.id} dragListener={false} dragControls={controls} drag={reorder?'y':false} as="li" className="card" data-testid="content-card" data-id={item.id} layout transition={{duration:0.15}}>
 <div className={`card-image ${item.kind}`}><img src={item.image} alt="" loading="lazy" onError={e=>{if(!e.currentTarget.src.includes('/art/'))e.currentTarget.src='/art/circuit.svg';}}/><span className="kind-label">{item.kind==='movie'?'Cinema':item.kind==='social'?'Community':'News'}{item.demo?' · Sample':''}</span>
 <button aria-label={`${favorite?'Unsave':'Save'} ${item.title}`} aria-pressed={favorite} className={`heart ${favorite?'saved':''}`} onClick={onFavorite}><Heart size={18} fill={favorite?'currentColor':'none'}/></button></div>
 <div className="card-body"><div className="eyebrow">{item.category} <span>· {item.source}</span></div><h3>{item.title}</h3>{item.source==='The Guardian'&&<a className="guardian-credit" href="https://www.theguardian.com" target="_blank" rel="noopener noreferrer"><img src="/brand/guardian.png" alt="Powered by The Guardian" width="140" /></a>}<p>{item.description}</p><div className="card-footer">{item.url?<a href={item.url} target="_blank" rel="noopener noreferrer">{item.kind==='movie'?'View movie':item.kind==='social'?'View post':'Read story'} <ArrowUpRight size={16}/></a>:<span className="muted">Illustrative sample</span>}
 {reorder&&<div className="reorder-controls"><button aria-label={`Move ${item.title} up`} disabled={index===0} onClick={()=>onMove(-1)}><ArrowUp size={14}/></button><button aria-label={`Move ${item.title} down`} disabled={index===count-1} onClick={()=>onMove(1)}><ArrowDown size={14}/></button><button aria-label={`Drag ${item.title}`} className="drag-handle" onPointerDown={event=>controls.start(event)}><GripVertical size={18}/></button></div>}</div></div>
 </Reorder.Item>;
}
