import { readSourceConfig } from "@/lib/dataBuilder";
import { notFound } from "next/navigation";
import Link from "next/link";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ReviewItem = {
  author?: string;
  rating?: number | string;
  text?: string;
};

function normalizeRating(value: number | string | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 5;
  return Math.max(0, Math.min(5, Math.round(parsed)));
}

function getServiceDescription(service: string): string {
  const lower = service.toLowerCase();

  if (lower.includes("implant")) {
    return "Long-lasting replacement solutions with careful planning and precise execution.";
  }

  if (lower.includes("aligner") || lower.includes("orthodont")) {
    return "Structured treatment plans designed to improve alignment, bite, and long-term comfort.";
  }

  if (lower.includes("cosmetic") || lower.includes("smile")) {
    return "Aesthetic-focused care that improves confidence while preserving natural function.";
  }

  if (lower.includes("root canal") || lower.includes("endodont")) {
    return "Targeted therapy focused on pain relief, infection control, and preservation of natural teeth.";
  }

  if (lower.includes("clean") || lower.includes("prevent")) {
    return "Preventive care that supports healthy gums, strong teeth, and fewer long-term complications.";
  }

  return "Personalized treatment pathways tailored to your goals, comfort, and clinical requirements.";
}

export default async function ClinicHome({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/template4/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, business, doctor, media, reviews } = data;
  const heroImage =
    media?.clinicImages?.[0] ||
    media?.treatmentImages?.[0] ||
    media?.otherImages?.[0] ||
    "/images/dental_hero.webp";
  const doctorImage =
    doctor?.images?.[0] ||
    media?.otherImages?.[0] ||
    media?.clinicImages?.[1] ||
    "/images/founders.jpg";

  const allImages = [
    ...(media?.clinicImages || []),
    ...(media?.treatmentImages || []),
    ...(media?.otherImages || []),
  ].filter(Boolean);

  const galleryPreviewImages =
    allImages.length > 0 ? allImages.slice(0, 3) : [heroImage, doctorImage];

  const services = business?.services?.length
    ? business.services.slice(0, 4)
    : [
        "General Dentistry",
        "Cosmetic Dentistry",
        "Dental Implants",
        "Orthodontic Care",
      ];

  const highlights = business?.highlights?.length
    ? business.highlights.slice(0, 4)
    : [
        "Experienced specialists",
        "Modern diagnostic equipment",
        "Patient-first approach",
        "Transparent treatment planning",
      ];

  const defaultReviews: ReviewItem[] = [
    {
      author: "Patient",
      rating: 5,
      text: "Excellent care and very clear communication throughout the treatment journey.",
    },
    {
      author: "Patient",
      rating: 5,
      text: "The team made every visit smooth, comfortable, and highly professional.",
    },
    {
      author: "Patient",
      rating: 5,
      text: "Great facilities, thoughtful specialists, and results we are very happy with.",
    },
  ];

  const displayReviews: ReviewItem[] =
    reviews && reviews.length > 0 ? reviews.slice(0, 3) : defaultReviews;

  const tagline = clinic.tagline || "Precision care for every smile.";
  const words = tagline.split(" ");
  const title1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const title2 = words.slice(Math.ceil(words.length / 2)).join(" ");

  // Use wa.me fallback
  const waphone = clinic.contact?.phone?.replace(/\D/g, "") || "919751396117";
  const watext = `Hi, I'm interested in booking a consultation at ${clinic.name || "your clinic"}!`;
  const walink = `https://wa.me/${waphone}?text=${encodeURIComponent(watext)}`;

  return (
    <>
      <section className="hero-clean">
        <div className="container">
          <div className="hero-left">
            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: "700",
                letterSpacing: "3px",
                color: "#888",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              {clinic.name?.toUpperCase() || ""}
            </p>
            <h1
              className="massive-text"
              style={{
                fontSize: "5.5rem",
                lineHeight: "0.9",
                paddingBottom: "20px",
              }}
            >
              {title1}
              <br />
              {title2}
            </h1>
            <p className="hero-subtext">{clinic.description || ""}</p>
            <div
              className="hero-actions"
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href={walink}
                target="_blank"
                rel="noreferrer"
                className="btn-dark"
              >
                BOOK CONSULTATION
              </a>
              <Link href={`${basePath}/services`} className="btn-outline">
                VIEW SERVICES
              </Link>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image-wrapper">
              <img
                src={heroImage}
                alt={clinic.name || "Clinic"}
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/*  About the Founders  */}
      <section className="section-block" id="about">
        <div className="container block-grid">
          <div className="block-visual slide-up">
            <img src={doctorImage} alt="Specialist" className="editorial-img" />
          </div>
          <div
            className="block-content slide-up"
            style={{ transitionDelay: "200ms" }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: "700",
                letterSpacing: "3px",
                color: "#888",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Meet The Team
            </p>
            <h2 className="block-title" style={{ fontSize: "3.5rem" }}>
              {doctor?.name?.toUpperCase() || "THE CARE TEAM"}
            </h2>
            <p className="block-desc">
              {clinic.description ||
                "We provide treatment built on trust, clarity, and measurable outcomes."}
            </p>
            <p className="block-desc" style={{ marginBottom: 0 }}>
              {doctor?.specialization ||
                "Comprehensive care across preventive, restorative, and cosmetic disciplines."}
            </p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-block bg-light" id="highlights">
        <div className="container">
          <div
            className="section-header-center slide-up"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 className="block-title">WHY CHOOSE US.</h2>
            <p
              className="section-subtitle"
              style={{
                fontSize: "1.25rem",
                color: "#555",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              We combine specialist expertise, practical technology, and
              patient-first communication in every consultation.
            </p>
          </div>

          <div className="vault-grid slide-up">
            {highlights.map((highlight: string, index: number) => (
              <div className="vault-item" key={index}>
                <p
                  className="mini-label"
                  style={{ marginBottom: "18px", color: "#222" }}
                >
                  0{index + 1}
                </p>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: 900,
                    lineHeight: 1.3,
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  {highlight}
                </h3>
                <p style={{ color: "#555", lineHeight: 1.6 }}>
                  Structured planning, clear expectations, and quality-focused
                  execution from start to finish.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-block" id="programs">
        <div className="container">
          <div
            className="section-header-center slide-up"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 className="block-title">OUR SERVICES.</h2>
            <p
              className="section-subtitle"
              style={{
                fontSize: "1.25rem",
                color: "#555",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              Explore how each treatment option is planned around long-term
              comfort, function, and confidence.
            </p>
          </div>

          <div className="programs-grid" style={{ marginBottom: "40px" }}>
            {services.map((service: string, index: number) => (
              <div
                key={index}
                className="program-card slide-up"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={
                    index % 2 === 0 ? "program-header" : "program-header dark"
                  }
                >
                  <h3>{service.toUpperCase()}</h3>
                  <span
                    className={
                      index % 2 === 0
                        ? "program-badge"
                        : "program-badge dark-badge"
                    }
                  >
                    TREATMENT PLAN
                  </span>
                </div>
                <div style={{ padding: "40px" }}>
                  <p style={{ color: "#444", lineHeight: "1.6" }}>
                    {getServiceDescription(service)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="center-btn-wrap" style={{ textAlign: "center" }}>
            <Link href={`${basePath}/services`} className="btn-dark">
              VIEW ALL SERVICES
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="section-block bg-light" id="gallery">
        <div className="container">
          <div
            className="section-header-center slide-up"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 className="block-title">VISUAL GALLERY.</h2>
            <p
              className="section-subtitle"
              style={{ fontSize: "1.25rem", color: "#555" }}
            >
              A quick look at our clinic environment, treatment setup, and care
              standards.
            </p>
          </div>

          <div className="vault-grid slide-up" style={{ marginBottom: "50px" }}>
            {galleryPreviewImages.map((image: string, index: number) => (
              <div
                key={index}
                className="vault-item"
                style={{ padding: 0, overflow: "hidden" }}
              >
                <img
                  src={image}
                  alt={`Gallery preview ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "320px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="center-btn-wrap" style={{ textAlign: "center" }}>
            <Link href={`${basePath}/gallery`} className="btn-outline">
              OPEN FULL GALLERY
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section-block" id="reviews">
        <div className="container">
          <div
            className="section-header-center slide-up"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 className="block-title">PATIENT STORIES.</h2>
            <p
              className="section-subtitle"
              style={{ fontSize: "1.25rem", color: "#555" }}
            >
              Don&apos;t just take our word for it. Read real experiences from
              our valued community.
            </p>
          </div>

          <div className="vault-grid slide-up">
            {displayReviews.map((review: ReviewItem, index: number) => (
              <div className="vault-item" key={index}>
                <div
                  className="v-icon"
                  style={{
                    fontSize: "2rem",
                    marginBottom: "20px",
                    color: "var(--black)",
                    letterSpacing: "2px",
                  }}
                >
                  {"★".repeat(normalizeRating(review.rating || 5))}
                  {"☆".repeat(5 - normalizeRating(review.rating || 5))}
                </div>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "900",
                    marginBottom: "15px",
                    textTransform: "uppercase",
                  }}
                >
                  {review.author || "Patient"}
                </h3>
                <p
                  style={{
                    color: "#444",
                    lineHeight: "1.6",
                    fontStyle: "italic",
                  }}
                >
                  &quot;{review.text || "Great care and a smooth experience."}
                  &quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="section-block"
        style={{ backgroundColor: "var(--black)", color: "var(--white)" }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            className="massive-text"
            style={{
              fontSize: "3.8rem",
              lineHeight: 1,
              marginBottom: "18px",
              color: "var(--white)",
            }}
          >
            READY TO BEGIN?
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#bdbdbd",
              maxWidth: "760px",
              margin: "0 auto 36px",
            }}
          >
            Book your consultation and receive a treatment roadmap tailored to
            your needs.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <a
              href={walink}
              target="_blank"
              rel="noreferrer"
              className="btn-dark"
              style={{ backgroundColor: "var(--white)", color: "var(--black)" }}
            >
              CHAT ON WHATSAPP
            </a>
            <Link
              href={`${basePath}/contact-us`}
              className="btn-outline"
              style={{ borderColor: "var(--white)", color: "var(--white)" }}
            >
              CONTACT CLINIC
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
