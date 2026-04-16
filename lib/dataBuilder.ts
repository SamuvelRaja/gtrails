import fs from 'fs/promises';
import path from 'path';

export interface GeneratedData {
  clinic: any;
  business: any;
  doctor: any;
  reviews: any[];
  media: any;
  overrides: any;
  meta: any;
}

export async function createSourceConfig(slug: string, data: any): Promise<GeneratedData> {
  const sourcePath = path.join(process.cwd(), 'data', slug, 'source.json');

  const defaultServices = [
    'Teeth Cleaning',
    'Root Canal Treatment',
    'Dental Implants',
    'Braces & Aligners',
    'Teeth Whitening'
  ];

  const defaultHighlights = [
    'Experienced dental team',
    'Modern equipment',
    'Patient-friendly care'
  ];

  const dataShape: GeneratedData = {
    clinic: {
      name: data.name || '',
      slug: slug,
      tagline: `Exceptional Dental Care in Your City`,
      description: `Welcome to ${data.name || 'our clinic'}. Providing top-tier dental services tailored to your needs in a comfortable environment.`,
      address: {
        full: data.address || '',
        area: '',
        city: '',
        state: 'Tamil Nadu',
        country: 'India'
      },
      contact: {
        phone: data.phone || '',
        website: ''
      }
    },
    business: {
      rating: data.rating || '',
      reviewCount: data.reviewCount || '',
      timings: [],
      services: defaultServices,
      highlights: defaultHighlights
    },
    doctor: {
      name: `Dr. ${data.name.split(' ')[0] || 'Clinic'} Team`,
      images: [],
      experience: '5+ years',
      specialization: 'General Dentistry'
    },
    reviews: data.reviews && data.reviews.length > 0 ? data.reviews : [
      {
        author: 'John Doe',
        rating: '5',
        text: 'Great experience, highly recommend!'
      }
    ],
    media: {
      clinicImages: data.media?.clinicImages || [],
      treatmentImages: data.media?.treatmentImages || [],
      otherImages: data.media?.otherImages || []
    },
    overrides: {
      doctorName: '',
      doctorImages: [],
      extraImages: []
    },
    meta: {
      generatedAt: new Date().toISOString(),
      source: 'google_maps'
    }
  };

  // Attempt to extract city/state from the full address if needed.
  if (data.address) {
    const parts = data.address.split(',');
    if (parts.length > 2) {
      dataShape.clinic.address.city = parts[parts.length - 3].trim();
      dataShape.clinic.address.state = parts[parts.length - 2].trim();
    }
  }

  await fs.writeFile(sourcePath, JSON.stringify(dataShape, null, 2), 'utf-8');

  return dataShape;
}

export async function readSourceConfig(slug: string): Promise<GeneratedData | null> {
  const sourcePath = path.join(process.cwd(), 'data', slug, 'source.json');
  try {
    const content = await fs.readFile(sourcePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}
