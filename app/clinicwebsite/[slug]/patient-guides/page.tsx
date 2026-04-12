import { readSourceConfig } from '@/lib/dataBuilder';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, ArrowRight, Phone, CheckCircle2, AlertTriangle,
  Lightbulb, Baby, Droplets, Zap, ShieldCheck, Clock
} from 'lucide-react';

export default async function PatientGuidesPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic } = data;

  const guides = [
    {
      icon: Zap,
      category: 'Pain & Sensitivity',
      title: 'Why Does My Tooth Hurt When I Drink Something Cold?',
      intro: 'If you find yourself wincing every time you take a sip of cold water or bite into ice cream, you are not alone. Tooth sensitivity is one of the most common dental complaints — but it is also one of the most misunderstood.',
      sections: [
        {
          heading: 'What Causes Cold Sensitivity?',
          content: 'The most common cause is exposed dentin — the layer beneath your enamel. When enamel wears down from aggressive brushing, acidic foods, or grinding, the microscopic tubules in dentin become exposed, allowing cold stimuli to reach the nerve directly. Other causes include recent dental work, cracked teeth, receding gums, or cavities.',
        },
        {
          heading: 'When Should You See a Dentist?',
          content: 'If the sensitivity is sharp and lasts more than a few seconds, occurs on a specific tooth, or is accompanied by swelling, that is your signal to schedule an appointment. These could indicate a cavity, a cracked tooth, or an early-stage infection that — if caught now — can be treated conservatively.',
        },
      ],
      tips: [
        'Use a soft-bristled toothbrush and avoid aggressive horizontal scrubbing',
        'Switch to a desensitising toothpaste containing potassium nitrate',
        'Avoid acidic beverages (soda, citrus juices) directly before brushing',
        'Schedule a professional fluoride varnish application at your next visit',
      ],
    },
    {
      icon: AlertTriangle,
      category: 'Post-Treatment Recovery',
      title: 'Face Swelling 2 Days After Root Canal: Causes and Solutions',
      intro: 'You just had a root canal. The worst is supposed to be over — but now, two days later, your face is still swollen and you are not sure if that is normal. This guide will help you understand what to expect during recovery.',
      sections: [
        {
          heading: 'Is Swelling Normal After a Root Canal?',
          content: 'Some degree of swelling within the first 48–72 hours is completely normal, especially for teeth with a significant pre-existing infection. Your body is working to heal the area, and inflammation is part of that process. The swelling typically peaks around day 2–3 and then steadily subsides.',
        },
        {
          heading: 'Warning Signs That Require Attention',
          content: 'Contact your dentist immediately if the swelling is increasing after day 3, you develop a fever above 101°F, you have difficulty breathing or swallowing, or the pain is intensifying rather than decreasing. These could indicate a secondary infection that needs prompt antibiotic treatment.',
        },
      ],
      tips: [
        'Apply an ice pack (wrapped in a cloth) for 15 minutes on, 15 minutes off',
        'Keep your head elevated when sleeping to reduce fluid accumulation',
        'Take prescribed medications exactly as directed — do not skip doses',
        'Avoid chewing on the treated side until your permanent crown is placed',
      ],
    },
    {
      icon: Clock,
      category: 'Post-Treatment Recovery',
      title: 'Jaw Pain and Recovery After Wisdom Tooth Extraction',
      intro: 'The first few days after wisdom tooth removal are always rough — the swelling, the ice packs, the soup-only diet. But if your jaw still hurts two weeks later, you might be wondering if something went wrong.',
      sections: [
        {
          heading: 'Typical Recovery Timeline',
          content: 'Days 1–3: Maximum swelling and discomfort. Days 4–7: Gradual improvement, bruising may appear. Days 7–14: Most patients feel significantly better. For lower wisdom teeth or impacted extractions, mild jaw stiffness can persist for 2–3 weeks as the muscles recover from being held open during surgery.',
        },
        {
          heading: 'What Is Dry Socket?',
          content: 'Dry socket (alveolar osteitis) occurs when the blood clot in the extraction site dislodges prematurely, exposing the underlying bone. It typically causes severe, throbbing pain starting 2–4 days post-extraction that radiates to your ear. If you suspect dry socket, visit your dentist — they will place a medicated dressing that provides rapid relief.',
        },
      ],
      tips: [
        'Avoid using straws, spitting forcefully, or smoking for at least 5 days',
        'Rinse gently with warm salt water starting 24 hours after surgery',
        'Gradually introduce soft foods — yogurt, mashed potatoes, scrambled eggs',
        'Perform gentle jaw-opening exercises after one week to reduce stiffness',
      ],
    },
    {
      icon: Droplets,
      category: 'Cosmetic Dentistry',
      title: 'The Truth About Teeth Whitening: Professional vs. At-Home',
      intro: 'Teeth whitening is the most requested cosmetic dental procedure in the world. But with so many options — from drugstore strips to Instagram-promoted kits — how do you know what actually works and what might harm your teeth?',
      sections: [
        {
          heading: 'Professional In-Office Whitening',
          content: 'In-office whitening uses clinical-grade hydrogen peroxide (25–40% concentration) activated by LED light or laser. A trained clinician protects your gums with a barrier gel before application. Results: 4–8 shades whiter in a single 60-minute session. The concentration is too strong for unsupervised use, which is why it delivers dramatically superior results to any at-home product.',
        },
        {
          heading: 'Why Over-the-Counter Products Fall Short',
          content: 'Most whitening strips contain only 6–10% hydrogen peroxide — enough to remove some surface stains but far too weak to penetrate deep discolouration. Whitening toothpastes rely on abrasives that can actually damage enamel over time. And charcoal-based products? Zero clinical evidence supports their whitening claims, and they may cause enamel erosion.',
        },
      ],
      tips: [
        'Always get a professional dental exam before starting any whitening regimen',
        'Professional whitening results last 6–12 months with basic maintenance',
        'Avoid coffee, red wine, and tobacco for 48 hours after your session',
        'Use a custom take-home tray from your dentist for safe touch-ups',
      ],
    },
    {
      icon: Baby,
      category: 'Pediatric Care',
      title: 'How to Prepare Your Child for Their First Dental Visit',
      intro: 'A child\'s first dental experience sets the tone for a lifetime of oral health. A positive first visit builds trust and eliminates fear; a traumatic one can create dental anxiety that persists into adulthood. Here is how to set your child up for success.',
      sections: [
        {
          heading: 'When Should the First Visit Happen?',
          content: 'The American Academy of Pediatric Dentistry recommends a first dental visit by age 1 — or within 6 months of the first tooth erupting. Early visits are not about treatment; they are about building familiarity with the dental environment, screening for early issues, and giving you personalised guidance on teething, brushing, and diet.',
        },
        {
          heading: 'Five Steps to a Positive First Visit',
          content: '1) Talk about the dentist positively — avoid words like "pain," "needle," or "drill." 2) Read children\'s books about dental visits together. 3) Play "dentist" at home — count each other\'s teeth with a mirror. 4) Schedule the appointment during your child\'s best mood time (usually morning). 5) Let your child bring a comfort item like a favourite toy.',
        },
      ],
      tips: [
        'Choose a clinic with a dedicated pediatric area and child-friendly staff',
        'Avoid transferring your own dental anxiety — children are perceptive',
        'Celebrate the visit afterwards with a non-food reward like a sticker or toy',
        'Begin brushing with a rice-grain-sized amount of fluoride toothpaste at age 1',
      ],
    },
    {
      icon: ShieldCheck,
      category: 'Dental Implants',
      title: 'Understanding Dental Implants: Are You a Good Candidate?',
      intro: 'Dental implants are the gold standard for replacing missing teeth — but they are not right for everyone. This guide covers the key requirements, the procedure itself, and how to determine if implants are the best option for your situation.',
      sections: [
        {
          heading: 'Who Is a Good Candidate?',
          content: 'Ideal candidates have adequate jawbone density to support the titanium post, healthy gums free of periodontal disease, and are in generally good overall health. Non-smokers heal faster and have higher success rates. Age is rarely a barrier — we have successfully placed implants in patients from their 20s to their 80s.',
        },
        {
          heading: 'What If I Have Bone Loss?',
          content: 'Bone grafting has advanced significantly and can rebuild lost jawbone over a period of 3–6 months, making implant placement possible even in cases that were previously considered too challenging. Sinus lifts, ridge augmentation, and socket preservation are all routinely performed at our clinic to prepare sites for predictable implant success.',
        },
      ],
      tips: [
        'A 3D CBCT scan is essential — 2D X-rays alone are insufficient for planning',
        'Implant surgery is typically done under local anaesthesia and is less painful than expected',
        'Healing (osseointegration) takes 3–6 months — this is what makes implants so strong',
        'With proper care, dental implants can last 25+ years — many last a lifetime',
      ],
    },
  ];

  return (
    <>
      {/* Page Hero Banner */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
          <p className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4">Patient Education</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6">Guides Written By<br/>Our Dental Experts</h2>
          <p className="text-xl text-slate-300 max-w-3xl font-medium leading-relaxed">
            Empowering you with clear, honest, jargon-free information so you can make confident decisions about your dental health. Every guide is reviewed by our specialist team.
          </p>
        </div>
      </section>

      {/* Guides List */}
      <div className="bg-white">
        {guides.map((guide, idx) => {
          const isEven = idx % 2 === 0;
          const IconComp = guide.icon;

          return (
            <section key={idx} className={`py-20 lg:py-28 border-b border-slate-100 ${isEven ? 'bg-white' : 'bg-slate-50/50'}`}>
              <div className="max-w-4xl mx-auto px-6">
                {/* Category & Title */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">{guide.category}</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">{guide.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed mb-10 border-l-4 border-indigo-200 pl-6 italic">{guide.intro}</p>

                {/* Content Sections */}
                <div className="space-y-10 mb-12">
                  {guide.sections.map((section, sIdx) => (
                    <div key={sIdx}>
                      <h4 className="text-xl font-bold text-slate-900 mb-4">{section.heading}</h4>
                      <p className="text-slate-600 text-[17px] leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>

                {/* Tips Box */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-5">
                    <Lightbulb className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-slate-900 text-lg">Expert Tips</h4>
                  </div>
                  <ul className="space-y-3">
                    {guide.tips.map((tip, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-black text-white mb-4">Have Questions About Your Dental Health?</h3>
          <p className="text-xl text-indigo-100 mb-10 font-medium">Our specialists are here to provide personalised advice. No question is too small — your dental health matters.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${clinic.contact?.phone || ''}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-indigo-900 px-10 py-5 rounded-full font-black hover:bg-slate-50 hover:scale-105 transition-all duration-300 shadow-xl text-lg">
              <Phone className="w-5 h-5 text-indigo-600" /> Ask Our Specialists
            </a>
            <Link href={`${basePath}/contact-us`} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 border-2 border-white/30 text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-all duration-300 text-lg">
              Send Your Question <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
