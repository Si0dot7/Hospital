'use client'
import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import relatedSearchesData from './related_searches.json';
import type { Route } from 'next';

type RelatedSearch = { label: string; href: string };

// แปลงสตริง -> Route (รับเฉพาะ path ภายใน)
function toInternalRoute(path: string): Route {
  return path && path.startsWith('/') ? (path as Route) : ('/' as Route);
}

// เช็กภายนอก (http/https) — ถ้าใช่จะไม่ใช้ router.push
function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const [relatedSearches, setRelatedSearches] = useState<RelatedSearch[]>([]);
  const router = useRouter();

  useEffect(() => {
    setRelatedSearches(relatedSearchesData as RelatedSearch[]);
    document.title = 'ค้นหา';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-800">
      {/* Header with back button */}
      <header className="w-full flex items-center px-4 py-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label="Back"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </header>

      {/* Centered search box */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-xl flex flex-col items-center">
          <div className="flex items-center w-full bg-white/90 rounded-2xl shadow-2xl px-4 py-4 mb-6 border border-blue-200 backdrop-blur-md">
            <Search className="w-6 h-6 text-blue-400 mr-2" />
            <Input
              className="flex-1 border-none shadow-none text-lg focus:ring-0 focus:border-transparent bg-transparent text-gray-900 placeholder-gray-400"
              placeholder="ค้นหาบริการของฝ่าย HR"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="w-full mt-2">
            <div className="text-blue-200 text-sm mb-2">คำค้นหายอดนิยม</div>
            <div className="flex flex-wrap gap-2">
              {relatedSearches.map((item) => (
                <button
                  key={item.label}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200 transition border border-blue-200 shadow"
                  onClick={() => {
                    if (isExternal(item.href)) {
                      window.location.href = item.href; // ลิงก์ภายนอก
                    } else {
                      router.push(toInternalRoute(item.href)); // ✅ กลายเป็น Route
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
