'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Link, Loader2 } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [photosUrl, setPhotosUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gbpUrl: url, photosUrl: photosUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process URL');
      }

      router.push(`/edit/${data.slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">GBP Website Generator</h1>
        <p className="text-gray-500 text-center mb-8">Paste a Google Maps place link to instantly generate a 5-page clinic site.</p>
        
        <form onSubmit={handleIntake} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL (Main Profile)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                name="url"
                id="url"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border text-gray-900"
                placeholder="https://www.google.com/maps/place/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="photosUrl" className="block text-sm font-medium text-gray-700 mb-1">"See Photos" Link (Optional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                name="photosUrl"
                id="photosUrl"
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3 border text-gray-900"
                placeholder="https://www.google.com/maps/place/.../data=..."
                value={photosUrl}
                onChange={(e) => setPhotosUrl(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          
          <button
            type="submit"
            disabled={loading || !url}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Scraping & Processing (up to 30s)...
              </>
            ) : (
             'Generate Data'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
