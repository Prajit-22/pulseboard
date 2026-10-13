export const categories = ['technology', 'sports', 'finance', 'science', 'entertainment'] as const;
export type Category = typeof categories[number];
export type Kind = 'news' | 'movie' | 'social';
export type Item = { id: string; title: string; description: string; image: string; url: string; category: Category; kind: Kind; source: string; score: number; date: string; demo: boolean };
export type Preferences = { categories: Category[]; dark: boolean; name: string; hashtags: string[] };
export type FeedResponse = { items: Item[]; notices: string[]; modes: { news: string; movies: string; social: string } };
