import { hackerNews, guardian, mastodon } from './public-providers';
import { demoItems } from './fixtures';
import { categories, type Category, type FeedResponse, type Item } from './types';
const genres:Record<Category,number[]>={technology:[878],science:[99,878],sports:[99],finance:[18,99],entertainment:[35,12]};
export function safeUrl(value:unknown):string {if(typeof value!=='string')return '';try{const u=new URL(value);return u.protocol==='https:'?u.href:'';}catch{return '';}}
async function json(url:URL,headers?:HeadersInit){const response=await fetch(url,{headers,signal:AbortSignal.timeout(8000),cache:'no-store'});if(!response.ok)throw new Error('Provider unavailable');return response.json();}
export async function getFeed(selected:Category[],query:string,tags:string[]):Promise<FeedResponse>{
 const demo=demoItems().filter(i=>selected.includes(i.category));let news=demo.filter(i=>i.kind==='news'),movies=demo.filter(i=>i.kind==='movie');
 const notices:string[]=[];let newsMode='demo',movieMode='demo',socialMode='demo';
 if(process.env.NEWS_API_KEY && process.env.NEWS_PROVIDER==='newsapi'){try{
  const data=await Promise.all(selected.map(async category=>{const url=new URL(query?'https://newsapi.org/v2/everything':'https://newsapi.org/v2/top-headlines');url.searchParams.set('language','en');url.searchParams.set('pageSize','12');if(query)url.searchParams.set('q',`${query} ${category}`);else url.searchParams.set('category',category==='finance'?'business':category);const result=await json(url,{'X-Api-Key':process.env.NEWS_API_KEY!});if(!Array.isArray(result.articles))throw new Error('Invalid articles');return result.articles.filter((a:Record<string,unknown>)=>typeof a.title==='string'&&a.title!=='[Removed]').map((a:Record<string,unknown>):Item=>({id:`news-${safeUrl(a.url)}`,title:String(a.title),description:typeof a.description==='string'?a.description:'No description available.',image:safeUrl(a.urlToImage)||'/art/circuit.svg',url:safeUrl(a.url),category,kind:'news',source:(a.source as {name?:string})?.name||'NewsAPI',score:50,date:String(a.publishedAt||''),demo:false}));}));news=data.flat();newsMode='live';
 }catch{notices.push('NewsAPI unavailable. Showing labeled sample news instead.');}}else {
 const real:Item[]=[];const covered=new Set<Category>();
 if(process.env.GUARDIAN_API_KEY){try{real.push(...await guardian(selected,query));selected.forEach(c=>covered.add(c));}catch{notices.push('Guardian unavailable. Uncovered news categories use labeled samples.');}}
 if(!covered.has('technology')&&selected.includes('technology')){try{real.push(...await hackerNews(query));covered.add('technology');}catch{notices.push('Hacker News unavailable. Technology news uses labeled samples.');}}
 news=[...real,...news.filter(i=>!covered.has(i.category))];newsMode=covered.size===selected.length?'live':covered.size?'mixed':'demo';
 const missing=selected.filter(c=>!covered.has(c));if(missing.length)notices.push(`Sample news for ${missing.join(', ')}: add GUARDIAN_API_KEY for non-commercial Guardian coverage. Hacker News covers technology only.`);
 }
 if(process.env.TMDB_API_KEY){try{
 const selectedGenres=[...new Set(selected.flatMap(c=>genres[c]))];const url=new URL(query?'https://api.themoviedb.org/3/search/movie':'https://api.themoviedb.org/3/discover/movie');url.searchParams.set('api_key',process.env.TMDB_API_KEY);url.searchParams.set('include_adult','false');url.searchParams.set('language','en-US');if(query)url.searchParams.set('query',query);else{url.searchParams.set('with_genres',selectedGenres.join('|'));url.searchParams.set('sort_by','popularity.desc');}
 const data=await json(url);if(!Array.isArray(data.results))throw new Error('Invalid movies');movies=data.results.map((m:{id:number;title:string;overview:string;poster_path:string;genre_ids:number[];popularity:number;release_date:string}):Item=>({id:`tmdb-${m.id}`,title:m.title,description:m.overview||'No synopsis available.',image:m.poster_path?`https://image.tmdb.org/t/p/w500${m.poster_path}`:'/art/movie.svg',url:`https://www.themoviedb.org/movie/${m.id}`,category:selected.find(c=>genres[c].some(g=>m.genre_ids?.includes(g)))||selected[0],kind:'movie',source:'TMDB',score:m.popularity,date:m.release_date,demo:false}));movieMode='live';
 }catch{notices.push('Movie provider unavailable. Showing labeled sample movies instead.');}}else notices.push('Sample movies: add TMDB_API_KEY on the server for real recommendations.');
 let social=demo.filter(i=>i.kind==='social').filter(i=>!tags.length||tags.some(t=>i.category.includes(t.toLowerCase())||i.description.toLowerCase().includes(t.toLowerCase())));
 try{social=await mastodon(selected,tags,query);socialMode='live';if(!social.length)notices.push('No public Mastodon posts matched the selected hashtags/search.');}catch{notices.push('Mastodon unavailable. Showing labeled sample community posts instead.');}
 notices.push('Live community posts are public user posts, not verified reporting. Sensitive and content-warning posts are skipped; moderation is not guaranteed. HN points, TMDB popularity and Mastodon reactions are different scores.');
 const unique=new Map<string,Item>();const interleaved:Item[]=[];for(let i=0;i<Math.max(news.length,movies.length,social.length);i++){if(news[i])interleaved.push(news[i]);if(movies[i])interleaved.push(movies[i]);if(social[i])interleaved.push(social[i]);}interleaved.forEach(i=>unique.set(i.id,i));
 const q=query.toLowerCase();const items=[...unique.values()].filter(i=>!i.demo||!q||`${i.title} ${i.description} ${i.category} ${i.source}`.toLowerCase().includes(q));
 return {items,notices,modes:{news:newsMode,movies:movieMode,social:socialMode}};
}
export function parseCategories(raw:string|null):Category[]{const chosen=(raw||'').split(',').filter(c=>categories.includes(c as Category)) as Category[];return chosen.length?[...new Set(chosen)]:['technology','science','entertainment'];}
