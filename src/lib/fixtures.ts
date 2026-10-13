import { categories, type Item, type Category } from './types';
const stories: Record<Category, [string,string,string][]> = {
 technology: [['Small models, big possibilities','A sample story about running language models on everyday devices.','circuit'],['The next wave of open-source tools','Independent developers are building useful, focused software.','code']],
 sports: [['The art of the comeback','A sample match analysis about preparation, teamwork and momentum.','sport'],['Beyond the finish line','A look at the training routines behind endurance sports.','sport']],
 finance: [['A beginner’s guide to index investing','Understanding diversification and long-term habits. Educational demo content, not advice.','finance'],['Making sense of your first budget','Simple systems for tracking expenses and planning ahead.','finance']],
 science: [['Looking further into the cosmos','A sample science story exploring how telescopes reveal distant worlds.','space'],['A quieter future for clean energy','How researchers test new ways to store renewable energy.','science']],
 entertainment: [['The stories we keep returning to','A sample feature about the films that stay with us.','movie'],['Inside an independent film studio','Small teams and the creative decisions behind a production.','movie']]
};
export function demoItems(): Item[] {
 const output: Item[] = [];
 for (const category of categories) {
  stories[category].forEach(([title,description,image],i)=>output.push({id:`demo-news-${category}-${i}`,title,description,image:`/art/${image}.svg`,url:'',category,kind:'news',source:'Pulseboard sample',score:80-i*3,date:'2026-10-13',demo:true}));
  output.push({id:`demo-movie-${category}`,title:({technology:'The thinking machine',sports:'One more lap',finance:'The long game',science:'Beyond the blue',entertainment:'A little cinema'} as const)[category],description:'A fictional recommendation used to preview the dashboard. Connect TMDB for real movies tailored to your interests.',image:'/art/movie.svg',url:'',category,kind:'movie',source:'Sample cinema',score:88,date:'2026-10-13',demo:true});
  output.push({id:`social-${category}`,title:`#${category} · Community notes`,description:`Mock social post: What have you been exploring in ${category} this week? Share one idea worth saving.`,image:'/art/social.svg',url:'',category,kind:'social',source:'@pulseboard · Mock social',score:65,date:'2026-10-13',demo:true});
 }
 return output;
}
