'use client';
import { Provider } from 'react-redux';
import { useRef } from 'react';
import { makeStore, type Store } from '@/lib/store';
import Dashboard from '@/components/Dashboard';
export default function Page(){const store=useRef<Store|null>(null);if(!store.current)store.current=makeStore();return <Provider store={store.current}><Dashboard/></Provider>;}
