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
  const basePath = `/clinicwebsite/template4/${slug}`;

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
      title: 'Face Swelling 2 Days After Root Canal',
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
      title: 'Jaw Pain After Wisdom Tooth Extraction',
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
      title: 'Professional vs. At-Home Teeth Whitening',
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
      title: 'Preparing Your Child for the Dentist',
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
      title: 'Are You a Candidate for Implants?',
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
    <div className="font-sans text-blue-900 bg-gray-50 min-h-screen selection:bg-blue-900 selection:text-white">
      {/* Page Hero Banner */}
      <section className="relative text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/heroes/patient_guides_hero_1776016856386.png" alt="Patient Guides" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-blue-900/75"></div>
          <div className="absolute inset-0 bg-linear-to-t from-blue-900 via-blue-900/40 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 w-full relative z-10">
          <p className="text-gray-400 font-semibold tracking-[0.15em] uppercase text-xs mb-6">Patient Education</p>
          <div className="flex flex-col mb-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-500 leading-none tracking-tighter">Guides Written By</h2>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-none tracking-tighter -mt-1.5">Our Dental Experts</h2>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl font-light leading-relaxed">
            Empowering you with clear, honest, jargon-free information so you can make confident decisions about your dental health. Every guide is reviewed by our specialist team.
          </p>
        </div>
      </section>

      {/* Guides List */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-8 w-full pt-16">
        {guides.map((guide, idx) => {
          const IconComp = guide.icon;

          return (
            <article key={idx} className="mb-24 pb-24 border-b border-gray-100 last:border-0 last:mb-0 last:pb-16">
                {/* Category & Title */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 bg-gray-50">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-gray-500 font-semibold text-xs tracking-[0.15em] uppercase">{guide.category}</span>
                </div>

                <h3 className="text-4xl lg:text-5xl font-normal text-blue-900 mb-8 leading-tight tracking-tight">{guide.title}</h3>
                <p className="text-gray-500 text-[18px] leading-relaxed mb-12 border-l-2 border-gray-200 pl-6 italic font-light">{guide.intro}</p>

                {/* Content Sections */}
                <div className="space-y-12 mb-12">
                  {guide.sections.map((section, sIdx) => (
                    <div key={sIdx}>
                      <h4 className="text-xl font-medium text-blue-900 mb-4">{section.heading}</h4>
                      <p className="text-gray-600 text-[16px] leading-relaxed font-light">{section.content}</p>
                    </div>
                  ))}
                </div>

                {/* Tips Box */}
                <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <Lightbulb className="w-5 h-5 text-gray-600" />
                    <h4 className="font-medium text-blue-900 text-lg">Expert Tips</h4>
                  </div>
                  <ul className="space-y-4">
                    {guide.tips.map((tip, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0" />
                        <span className="text-gray-600 font-light">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
            </article>
          );
        })}
        </div>
      </div>

      {/* Bottom CTA */}
      <section className="bg-blue-900 py-24 lg:py-40 text-white">
        <div className="max-w-4xl mx-auto px-8 text-center w-full">
          <div className="flex flex-col mb-8">
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-normal text-gray-500 leading-none tracking-tighter">Have Questions</h3>
            <h3 className="text-5xl md:text-6xl lg:text-7xl font-normal text-white leading-none tracking-tighter -mt-1.5">About Your Health?</h3>
          </div>
          <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl mx-auto">Our specialists are here to provide personalised advice. No question is too small — your dental health matters.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${clinic.contact?.phone || ''}`} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors text-sm tracking-wide">
              <Phone className="w-4 h-4" /> Ask Our Specialists
            </a>
            <Link href={`${basePath}/contact-us`} className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-600 text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm tracking-wide">
              Send Your Question <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
