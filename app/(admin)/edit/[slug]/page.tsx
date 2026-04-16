'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Settings2, Trash2, Star, Plus } from 'lucide-react';

export default function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  const router = useRouter();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingDraft, setSavingDraft] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/data?slug=${slug}`);
        if (!res.ok) throw new Error('Failed to load data');
        const json = await res.json();
        setData({
          ...json,
          reviews: Array.isArray(json?.reviews) ? json.reviews : []
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  const saveSourceData = async () => {
    if (!data) throw new Error('No data available to save');

    const res = await fetch('/api/data', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, sourceData: data })
    });

    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result?.error || 'Failed to save data');
    }
  };

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    setError('');
    setSaveMessage('');

    try {
      await saveSourceData();
      setSaveMessage('Changes saved successfully.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingDraft(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    setSaveMessage('');

    try {
      await saveSourceData();
      router.push(`/preview/${slug}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleChange = (section: string, field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedChange = (section: string, subsection: string, field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleArrayChange = (section: string, field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value.split('\n')
      }
    }));
  };

  const handleReviewChange = (index: number, field: string, value: string) => {
    setData((prev: any) => {
      const reviews = Array.isArray(prev.reviews) ? [...prev.reviews] : [];
      const current = reviews[index] || {};
      reviews[index] = { ...current, [field]: value };
      return { ...prev, reviews };
    });
  };

  const addReview = () => {
    setData((prev: any) => ({
      ...prev,
      reviews: [
        ...(Array.isArray(prev.reviews) ? prev.reviews : []),
        { author: '', rating: '5', text: '' }
      ]
    }));
  };

  const removeReview = (index: number) => {
    setData((prev: any) => {
      const reviews = Array.isArray(prev.reviews) ? [...prev.reviews] : [];
      reviews.splice(index, 1);
      return { ...prev, reviews };
    });
  };

  const removeImage = (category: string, index: number) => {
    setData((prev: any) => {
      const newArr = [...(prev.media[category] || [])];
      newArr.splice(index, 1);
      return { ...prev, media: { ...prev.media, [category]: newArr } };
    });
  };

  const makeHero = (category: string, index: number) => {
    setData((prev: any) => {
      const img = prev.media[category][index];
      if ((prev.media.clinicImages || []).length >= 5) {
        alert("Maximum 5 hero images allowed.");
        return prev;
      }
      const newCatArr = [...prev.media[category]];
      newCatArr.splice(index, 1);
      return {
        ...prev,
        media: {
          ...prev.media,
          [category]: newCatArr,
          clinicImages: [...(prev.media.clinicImages || []), img]
        }
      };
    });
  };
  
  const moveFromHero = (index: number) => {
    setData((prev: any) => {
      const img = prev.media.clinicImages[index];
      const newHeroArr = [...prev.media.clinicImages];
      newHeroArr.splice(index, 1);
      return {
        ...prev,
        media: {
          ...prev.media,
          clinicImages: newHeroArr,
          otherImages: [...(prev.media.otherImages || []), img]
        }
      };
    });
  };

  const addImageUrl = () => {
    const url = prompt("Enter new image URL:");
    if (url) {
      setData((prev: any) => ({
        ...prev,
        media: {
          ...prev.media,
          otherImages: [...(prev.media.otherImages || []), url.trim()]
        }
      }));
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>;
  if (error) return <div className="p-8 text-red-500 bg-gray-50 min-h-screen">Error: {error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-100 flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Settings2 className="h-7 w-7 text-blue-500" />
              Configure Website
            </h1>
            <p className="text-gray-500 text-sm mt-1">Refine the scraped data before final generation.</p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={savingDraft || generating}
              className="flex items-center py-3 px-6 rounded-lg shadow-sm text-sm font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 transition-all justify-center"
            >
              {savingDraft && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
              Save Changes
            </button>

            <button
              onClick={handleGenerate}
              disabled={savingDraft || generating}
              className="flex items-center py-3 px-8 rounded-lg shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition-all justify-center"
            >
              {generating && <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />}
              Save & Open Preview
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {saveMessage}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Column 1: Clinic Data */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">Clinic Information</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Clinic Name</label>
              <input className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" 
                     value={data.clinic.name} onChange={e => handleChange('clinic', 'name', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Tagline</label>
              <input className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" 
                     value={data.clinic.tagline} onChange={e => handleChange('clinic', 'tagline', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-none" 
                        rows={4} value={data.clinic.description} onChange={e => handleChange('clinic', 'description', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
              <input className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" 
                     value={data.clinic.contact.phone} onChange={e => handleNestedChange('clinic', 'contact', 'phone', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Address</label>
              <textarea className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-none" 
                        rows={2} value={data.clinic.address.full} onChange={e => handleNestedChange('clinic', 'address', 'full', e.target.value)} />
            </div>
          </div>

          {/* Column 2: Business & Doctor */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">Doctor & Business Meta</h2>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">GBP Rating</label>
                <input className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" 
                       value={data.business.rating} onChange={e => handleChange('business', 'rating', e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Review Count</label>
                <input className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" 
                       value={data.business.reviewCount} onChange={e => handleChange('business', 'reviewCount', e.target.value)} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Lead Doctor Name</label>
              <input className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" 
                     value={data.doctor.name} onChange={e => handleChange('doctor', 'name', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Specialization</label>
              <input className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" 
                     value={data.doctor.specialization} onChange={e => handleChange('doctor', 'specialization', e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Experience Info</label>
              <input className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors" 
                     value={data.doctor.experience} onChange={e => handleChange('doctor', 'experience', e.target.value)} />
            </div>
            
            <div className="pt-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Highlights (1 per line)</label>
              <textarea className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-none" 
                        rows={4} value={(data.business.highlights || []).join('\n')} onChange={e => handleArrayChange('business', 'highlights', e.target.value)} />
            </div>
          </div>

          {/* Full Width: Services */}
          <div className="lg:col-span-2 space-y-4">
             <h2 className="text-xl font-bold text-gray-800 pb-2 border-b border-gray-100">Services configuration (1 per line)</h2>
             <div>
                <textarea className="w-full text-gray-900 border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors resize-none" 
                          rows={6} value={(data.business.services || []).join('\n')} onChange={e => handleArrayChange('business', 'services', e.target.value)} />
             </div>
          </div>

          {/* Full Width: Reviews */}
          <div className="lg:col-span-2 space-y-4">
             <div className="flex justify-between items-center pb-2 border-b border-gray-100">
               <h2 className="text-xl font-bold text-gray-800">Patient Reviews</h2>
               <button onClick={addReview} className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                 <Plus className="w-4 h-4" /> Add Review
               </button>
             </div>

             {(data.reviews || []).length > 0 ? (
               <div className="space-y-4">
                 {(data.reviews || []).map((review: any, index: number) => (
                   <div key={index} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="font-semibold text-gray-800">Review {index + 1}</h3>
                       <button
                         onClick={() => removeReview(index)}
                         className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 px-2.5 py-1.5 rounded-md"
                       >
                         <Trash2 className="w-3.5 h-3.5" /> Remove
                       </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
                         <input
                           className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           value={review.author || ''}
                           onChange={e => handleReviewChange(index, 'author', e.target.value)}
                         />
                       </div>

                       <div>
                         <label className="block text-sm font-semibold text-gray-700 mb-1">Rating (1-5)</label>
                         <input
                           type="number"
                           min={1}
                           max={5}
                           className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                           value={review.rating ?? ''}
                           onChange={e => handleReviewChange(index, 'rating', e.target.value)}
                         />
                       </div>
                     </div>

                     <div className="mt-4">
                       <label className="block text-sm font-semibold text-gray-700 mb-1">Review Text</label>
                       <textarea
                         rows={3}
                         className="w-full text-gray-900 border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                         value={review.text || ''}
                         onChange={e => handleReviewChange(index, 'text', e.target.value)}
                       />
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-sm text-gray-500 italic p-4 bg-gray-50 border border-gray-100 rounded-lg">
                 No reviews available. Click Add Review to include one.
               </p>
             )}
          </div>

          {/* Full Width: Scraped Media */}
          <div className="lg:col-span-2 space-y-6 mt-4">
             <div className="flex justify-between items-center pb-2 border-b border-gray-100">
               <h2 className="text-xl font-bold text-gray-800">Media Manager</h2>
               <button onClick={addImageUrl} className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                 <Plus className="w-4 h-4" /> Add External Image URL
               </button>
             </div>
             
             <div className="space-y-8">
                {/* Hero Images Section */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <h3 className="text-md font-bold text-blue-900 mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-500 fill-blue-500" />
                    Hero Section Slides (Max 5)
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {data.media?.clinicImages?.length > 0 ? data.media.clinicImages.map((src: string, i: number) => (
                      <div key={i} className="relative group">
                        <img src={src} className="w-40 h-40 object-cover rounded-lg border-2 border-blue-300 shadow-sm" alt={`Hero ${i}`} />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveFromHero(i)} className="bg-white/90 hover:bg-white p-1.5 rounded-md shadow text-gray-600 tooltip" title="Demote from Hero">
                            ↓
                          </button>
                          <button onClick={() => removeImage('clinicImages', i)} className="bg-red-500/90 hover:bg-red-600 p-1.5 rounded-md shadow text-white" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )) : <p className="text-sm text-gray-500 italic p-4">No hero images selected. Promote an image below to use it as a slide.</p>}
                  </div>
                </div>

                {/* Treatment Images Section */}
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Stored Gallery Images (Treatments)</h3>
                  <div className="flex flex-wrap gap-4">
                    {data.media?.treatmentImages?.length > 0 ? data.media.treatmentImages.map((src: string, i: number) => (
                      <div key={i} className="relative group">
                        <img src={src} className="w-32 h-32 object-cover rounded-lg border border-gray-200" alt="Treatment" />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => makeHero('treatmentImages', i)} className="bg-blue-500/90 hover:bg-blue-600 p-1.5 rounded-md shadow text-white" title="Set as Hero">
                            <Star className="w-4 h-4" />
                          </button>
                          <button onClick={() => removeImage('treatmentImages', i)} className="bg-red-500/90 hover:bg-red-600 p-1.5 rounded-md shadow text-white" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )) : <p className="text-sm text-gray-400">No treatment images found</p>}
                  </div>
                </div>

                {/* Other/External Images Section */}
                <div>
                  <h3 className="text-md font-semibold text-gray-700 mb-3">Other & External Images</h3>
                  <div className="flex flex-wrap gap-4">
                    {data.media?.otherImages?.length > 0 ? data.media.otherImages.map((src: string, i: number) => (
                      <div key={i} className="relative group">
                        <img src={src} className="w-32 h-32 object-cover rounded-lg border border-gray-200" alt="Other" />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => makeHero('otherImages', i)} className="bg-blue-500/90 hover:bg-blue-600 p-1.5 rounded-md shadow text-white" title="Set as Hero">
                            <Star className="w-4 h-4" />
                          </button>
                          <button onClick={() => removeImage('otherImages', i)} className="bg-red-500/90 hover:bg-red-600 p-1.5 rounded-md shadow text-white" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )) : <p className="text-sm text-gray-400">No other images available</p>}
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
