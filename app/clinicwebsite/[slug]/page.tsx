import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ template?: string }>;
};

export default async function ClinicWebsite({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const { slug } = resolvedParams;
  const templateId = resolvedSearchParams.template || '1';

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  // Basic layout binding
  const { clinic, doctor, business, meta, media } = data;

  const bgStyles = {
    '1': 'bg-white text-gray-900',
    '2': 'bg-blue-50 text-gray-800',
    '3': 'bg-[#1a1a1a] text-white',
  };

  const currentBg = bgStyles[templateId as keyof typeof bgStyles] || bgStyles['1'];

  return (
    <main className={`min-h-screen font-sans ${currentBg}`}>
      {/* Header */}
      <header className="py-6 px-12 border-b border-opacity-10 border-white shadow-sm flex justify-between items-center top-0 sticky bg-inherit z-50">
        <h1 className="text-3xl font-extrabold tracking-tight">{clinic.name}</h1>
        <nav className="hidden md:flex gap-8 font-medium">
          <a href="#about" className="hover:opacity-75">About Docs</a>
          <a href="#services" className="hover:opacity-75">Services</a>
          <a href="#contact" className="hover:opacity-75">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-24 px-12 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto">
        <div className="flex-1">
          <h2 className="text-5xl font-bold mb-6 italic">{clinic.tagline}</h2>
          <p className="text-xl mb-8 opacity-80 leading-relaxed">{clinic.description}</p>
          <div className="flex gap-4">
            <a href={`tel:${clinic.contact.phone}`} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105">Book Appointment</a>
          </div>
        </div>
        <div className="flex-1 w-full bg-gray-200 rounded-3xl overflow-hidden shadow-2xl min-h-[400px] border-4 border-white relative">
          {media.clinicImages?.length > 0 ? (
            // For now just showing the first Hero image, or you can implement a standard swiper later!
            <img src={media.clinicImages[0]} alt="Clinic Hero" className="w-full h-full object-cover object-center absolute inset-0" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 absolute inset-0">No Hero Image Found</div>
          )}
        </div>
      </section>

      {/* Services */}
      <section id="services" className={`py-24 px-12 ${templateId === '3' ? 'bg-black' : 'bg-gray-100'} text-center`}>
        <h3 className="text-4xl font-bold mb-16">Our Services</h3>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {business.services.map((svc: string, i: number) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow border border-gray-100 flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full mb-6"></div>
              <h4 className="text-xl text-gray-800 font-bold mb-3">{svc}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* About The Doctor */}
      <section id="about" className="py-24 px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="flex-1">
           <img src="https://via.placeholder.com/600x600?text=Doctor+Image" alt="Doctor" className="rounded-full shadow-xl max-w-md mx-auto aspect-square object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="text-4xl font-bold mb-6">About {doctor.name}</h3>
          <h4 className="text-2xl font-medium text-blue-600 mb-6">{doctor.specialization} • {doctor.experience}</h4>
          <p className="text-lg opacity-80 mb-6">
            We are dedicated to providing the highest quality dental care for your family.
          </p>
          <ul className="space-y-4">
             {business.highlights.map((h: string, i: number) => (
               <li key={i} className="flex items-center gap-3 text-lg font-medium">✓ {h}</li>
             ))}
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={`py-24 px-12 text-center text-gray-100 ${templateId === '3' ? 'bg-[#111]' : 'bg-gray-900'} relative`}>
        <h3 className="text-4xl font-bold mb-12">Visit Us</h3>
        <p className="text-xl mb-4 max-w-2xl mx-auto">{clinic.address.full}</p>
        <p className="text-2xl font-bold text-blue-400 mb-12">Call {clinic.contact.phone}</p>
        
        <p className="opacity-50 text-sm absolute bottom-8 left-0 right-0">Generated from {meta.source} | Reviews: {business.reviewCount} | Rating: {business.rating}</p>
      </section>

    </main>
  );
}
