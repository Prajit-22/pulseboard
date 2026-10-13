import { NextRequest, NextResponse } from 'next/server';
import { getFeed, parseCategories } from '@/lib/providers';
export const dynamic='force-dynamic';
export async function GET(request:NextRequest){const p=request.nextUrl.searchParams;const data=await getFeed(parseCategories(p.get('categories')),(p.get('q')||'').trim().slice(0,120),(p.get('tags')||'').split(',').map(t=>t.replace(/^#/,'').trim()).filter(Boolean).slice(0,8));return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}});}
