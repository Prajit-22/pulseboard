import { categories, type Preferences, type Item } from './types';
export const STORAGE_KEY='pulseboard:v1';
export const defaults: Preferences={categories:['technology','science','entertainment'],dark:false,name:'Explorer',hashtags:['technology','science']};
export function readSaved(raw: string|null) {
 try {
  const value=JSON.parse(raw||'{}'); const p=value.preferences||{};
  const selected=Array.isArray(p.categories)?p.categories.filter((c:unknown)=>categories.includes(c as never)):defaults.categories;
  return {preferences:{categories:selected.length?selected:defaults.categories,dark:typeof p.dark==='boolean'?p.dark:false,name:typeof p.name==='string'?p.name.slice(0,40):defaults.name,hashtags:Array.isArray(p.hashtags)?p.hashtags.filter((x:unknown)=>typeof x==='string').slice(0,8):defaults.hashtags} as Preferences,
   favorites:Array.isArray(value.favorites)?value.favorites.filter((x:unknown)=>typeof x==='string'):[],
   savedItems:Array.isArray(value.savedItems)?value.savedItems.filter((x:Item)=>x&&typeof x.id==='string'&&typeof x.title==='string'&&typeof x.description==='string'&&typeof x.image==='string'&&typeof x.url==='string'):[],
   order:Array.isArray(value.order)?value.order.filter((x:unknown)=>typeof x==='string'):[]};
 }catch{return {preferences:defaults,favorites:[],savedItems:[],order:[]};}
}
