'use client';

import { use } from 'react';
import Link from 'next/link';

export default function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;

  const templates = [
    { id: '1', name: 'Modern Dental', description: 'Clean, airy layout focusing on technology.', href: `/clinicwebsite/${slug}` },
    { id: '2', name: 'Family Care', description: 'Warm, approachable design for family dentistry.', href: `/clinicwebsite/template2/${slug}` },
    { id: '3', name: 'Premium Clinic', description: 'Elegant, high-end theme for aesthetic dentistry.', href: `/clinicwebsite/template3/${slug}` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">Website Generated Successfully!</h1>
        <p className="text-gray-500 text-center mb-12">Your data for <strong>{slug}</strong> has been bound to 3 distinct templates. Click below to preview them.</p>

        <div className="grid gap-6 md:grid-cols-3">
          {templates.map((tpl) => (
            <Link
              key={tpl.id}
              href={tpl.href}
              className="group block"
              target="_blank"
            >
              <div className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-md transition-all bg-gray-50">
                <div className="h-40 bg-gradient-to-br from-blue-100 to-white flex items-center justify-center">
                  <span className="text-xl font-semibold text-gray-700">Template {tpl.id}</span>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600">{tpl.name}</h3>
                  <p className="text-sm text-gray-600">{tpl.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-400">
          * Links open in a new tab. Output serves as a live preview.
        </div>
      </div>
    </div>
  );
}
