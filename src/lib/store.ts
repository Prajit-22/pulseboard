import { configureStore, createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { defaults } from './storage';
import type { FeedResponse, Item, Preferences } from './types';
export type DashboardState={preferences:Preferences;items:Item[];savedItems:Item[];favorites:string[];order:string[];status:'idle'|'loading'|'ready'|'error';error:string;notices:string[];modes:FeedResponse['modes']};
const initialState:DashboardState={preferences:defaults,items:[],savedItems:[],favorites:[],order:[],status:'idle',error:'',notices:[],modes:{news:'demo',movies:'demo',social:'mock'}};
export const fetchFeed=createAsyncThunk<FeedResponse,{preferences:Preferences;query:string}>('feed/fetch',async({preferences,query},{signal})=>{
 const params=new URLSearchParams({categories:preferences.categories.join(','),tags:preferences.hashtags.join(','),q:query});
 const res=await fetch(`/api/feed?${params}`,{signal}); if(!res.ok)throw new Error('Unable to load the feed. Please retry.');
 const data=await res.json();if(!Array.isArray(data.items))throw new Error('The feed response was invalid.');return data;
});
const slice=createSlice({name:'dashboard',initialState,reducers:{
 hydrate(state,action:PayloadAction<Pick<DashboardState,'preferences'|'favorites'|'order'|'savedItems'>>){Object.assign(state,action.payload);},
 setPreferences(state,action:PayloadAction<Preferences>){state.preferences=action.payload;},
 toggleFavorite(state,action:PayloadAction<Item>){const item=action.payload;if(state.favorites.includes(item.id)){state.favorites=state.favorites.filter(id=>id!==item.id);state.savedItems=state.savedItems.filter(i=>i.id!==item.id);}else{state.favorites.push(item.id);state.savedItems.push(item);}},
 setOrder(state,action:PayloadAction<string[]>){state.order=action.payload;}
},extraReducers:builder=>builder.addCase(fetchFeed.pending,state=>{state.status='loading';state.error='';}).addCase(fetchFeed.fulfilled,(state,action)=>{state.status='ready';state.items=action.payload.items;state.notices=action.payload.notices;state.modes=action.payload.modes;const ids=state.items.map(i=>i.id);state.order=[...state.order.filter(id=>ids.includes(id)),...ids.filter(id=>!state.order.includes(id))];}).addCase(fetchFeed.rejected,(state,action)=>{if(action.meta.aborted)return;state.status='error';state.error=action.error.message||'Unable to load feed';})});
export const {hydrate,setPreferences,toggleFavorite,setOrder}=slice.actions;
export const reducer=slice.reducer;
export const makeStore=()=>configureStore({reducer:{dashboard:reducer}});
export type Store=ReturnType<typeof makeStore>;
export type RootState=ReturnType<Store['getState']>;
export type AppDispatch=Store['dispatch'];
