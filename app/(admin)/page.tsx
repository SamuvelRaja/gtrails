'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Loader2, Link as LinkIcon, Database, LayoutTemplate } from 'lucide-react';

export default function IntakePage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/(google\.[^/]+\/maps|maps\.app\.goo\.gl|g\.page|maps\.google\.|g\.co|google\.[^/]+\/search|goo\.gl)/i.test(url)) {
      setError('Please provide a valid Google Maps URL.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gbpUrl: url }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to process URL');
      router.push(`/edit/${data.slug}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-[#fafafa] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full flex flex-col items-center">
        
        <div className="mb-10 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900">
            Generate a clinic website
          </h1>
          <p className="text-gray-500 text-lg">
            Paste a Google Maps URL, and we'll extract the data to build a ready-to-publish website automatically.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="w-full relative z-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-200 flex items-center focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition-all">
            <div className="pl-4 pr-2 text-gray-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <input
              type="url"
              className="flex-1 w-full bg-transparent border-none outline-none py-3 text-gray-900 placeholder-gray-400 text-base"
              placeholder="https://www.google.com/maps/place/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing
                </>
              ) : (
                <>
                  Generate <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-center justify-center">
              {error}
            </div>
          )}
        </form>

        <div className="mt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 pt-10">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-900">1. Input URL</h3>
            <p className="text-sm text-gray-500">Provide the business profile link</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-900">2. Data Extraction</h3>
            <p className="text-sm text-gray-500">We scrape images & reviews</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 border border-gray-200">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-gray-900">3. Edit & Publish</h3>
            <p className="text-sm text-gray-500">Choose a minimal template</p>
          </div>
        </div>

      </div>
    </div>
  );
}
