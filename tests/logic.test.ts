import { describe,it,expect,vi,afterEach } from 'vitest';
import { demoItems } from '../src/lib/fixtures';
import { visibleItems,mergePageOrder } from '../src/lib/selectors';
import { readSaved,defaults } from '../src/lib/storage';
import { reducer,toggleFavorite,setOrder,fetchFeed,makeStore } from '../src/lib/store';
import { getFeed,parseCategories,safeUrl } from '../src/lib/providers';
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();});
describe('feed logic',()=>{
 it('searches case insensitively across sources',()=>expect(visibleItems(demoItems(),'feed','TECHNOLOGY',[],[]).length).toBeGreaterThan(0));
 it('has an empty state for unknown query',()=>expect(visibleItems(demoItems(),'feed','impossiblephrase',[],[])).toEqual([]));
 it('filters favorites',()=>expect(visibleItems(demoItems(),'favorites','',[demoItems()[0].id],[])).toHaveLength(1));
 it('sorts trending by score',()=>{const result=visibleItems(demoItems(),'trending','',[],[]);expect(result[0].score).toBeGreaterThanOrEqual(result.at(-1)!.score);});
 it('keeps other pages when reordering',()=>expect(mergePageOrder(['a','b','c','d'],['a','b'],['b','a'])).toEqual(['b','a','c','d']));
 it('respects manual order',()=>expect(visibleItems(demoItems(),'feed','',[],[demoItems()[3].id])[0].id).toBe(demoItems()[3].id));
});
describe('persistence',()=>{
 it('recovers corrupt JSON',()=>expect(readSaved('broken').preferences).toEqual(defaults));
 it('rejects unknown and empty categories',()=>expect(readSaved('{"preferences":{"categories":["hacker"]}}').preferences.categories).toEqual(defaults.categories));
 it('keeps dark mode and name',()=>expect(readSaved('{"preferences":{"dark":true,"name":"Prajit"}}').preferences).toMatchObject({dark:true,name:'Prajit'}));
 it('toggles favorites and saves snapshots',()=>{let s=reducer(undefined,toggleFavorite(demoItems()[0]));expect(s.savedItems).toHaveLength(1);s=reducer(s,toggleFavorite(demoItems()[0]));expect(s.favorites).toHaveLength(0);expect(s.savedItems).toHaveLength(0);});
 it('stores a new order',()=>expect(reducer(undefined,setOrder(['b','a'])).order).toEqual(['b','a']));
});
describe('providers and async state',()=>{
 it('rejects invalid links',()=>{expect(safeUrl('javascript:alert(1)')).toBe('');expect(safeUrl('https://example.com')).toBe('https://example.com/');});
 it('normalizes categories',()=>expect(parseCategories('sports,sports,invalid')).toEqual(['sports']));
 it('runs without secrets using labeled samples',async()=>{vi.stubEnv('NEWS_API_KEY','');vi.stubEnv('TMDB_API_KEY','');const result=await getFeed(['technology'],'',[]);expect(result.items).toHaveLength(4);expect(result.items.every(i=>i.demo)).toBe(true);});
 it('falls back on failed providers',async()=>{vi.stubEnv('NEWS_API_KEY','test');vi.stubEnv('TMDB_API_KEY','test');vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('offline')));const result=await getFeed(['science'],'',[]);expect(result.notices).toHaveLength(2);expect(result.modes.news).toBe('demo');});
 it('parses live responses and keeps keys server-only',async()=>{vi.stubEnv('NEWS_API_KEY','test');vi.stubEnv('TMDB_API_KEY','test');vi.stubGlobal('fetch',vi.fn(async(url:URL)=>({ok:true,json:async()=>url.hostname==='newsapi.org'?{articles:[{title:'Live news',description:'News text',url:'https://example.com/story',source:{name:'Example'}}]}:{results:[{id:1,title:'Real movie',overview:'Movie text',genre_ids:[878],popularity:40}]} })));const result=await getFeed(['technology'],'',[]);expect(result.modes).toMatchObject({news:'live',movies:'live'});expect(result.items.some(i=>i.title==='Real movie'&&!i.demo)).toBe(true);expect(JSON.stringify(result)).not.toContain('api_key');});
 it('handles a thunk network failure',async()=>{vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('offline')));const store=makeStore();await store.dispatch(fetchFeed({preferences:defaults,query:''}));expect(store.getState().dashboard.status).toBe('error');});
 it('rejects malformed feed response',async()=>{vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ok:true,json:async()=>({})}));const store=makeStore();await store.dispatch(fetchFeed({preferences:defaults,query:''}));expect(store.getState().dashboard.error).toContain('invalid');});
});
