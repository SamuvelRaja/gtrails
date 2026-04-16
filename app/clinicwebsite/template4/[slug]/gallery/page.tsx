import { readSourceConfig } from "@/lib/dataBuilder";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/template4/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, business, media } = data;
  const allImages = [
    ...(media?.clinicImages || []),
    ...(media?.treatmentImages || []),
    ...(media?.otherImages || []),
  ].filter(Boolean);

  const displayImages =
    allImages.length > 0
      ? allImages.slice(0, 12)
      : ["/images/dental_hero.webp", "/images/founders.jpg"];

  const labels = business?.services?.length
    ? business.services
    : [
        "Clinic Environment",
        "Treatment Setup",
        "Patient Care",
        "Clinical Process",
      ];

  const featureImage = displayImages[0] || "/images/dental_hero.webp";

  return (
    <div style={{ paddingTop: "150px" }}>
      <section className="hero-clean">
        <div className="container">
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
            GALLERY
          </p>
          <h1
            className="massive-text"
            style={{
              fontSize: "4.5rem",
              lineHeight: "0.9",
              paddingBottom: "20px",
            }}
          >
            VISUAL GALLERY
          </h1>
          <p className="hero-subtext">
            Explore our clinic spaces, treatment workflows, and patient-first
            care environment.
          </p>
        </div>
      </section>

      <section className="section-block bg-light" id="gallery">
        <div className="container">
          <div
            className="section-header-center slide-up"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 className="block-title">FACILITY SNAPSHOTS.</h2>
            <p
              className="section-subtitle"
              style={{
                fontSize: "1.25rem",
                color: "#555",
                maxWidth: "820px",
                margin: "0 auto",
              }}
            >
              A quick preview of how we maintain quality, hygiene standards, and
              comfort throughout the patient journey.
            </p>
          </div>

          <div className="vault-grid slide-up">
            {displayImages.map((img: string, index: number) => (
              <div
                key={index}
                className="vault-item"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  background: "#000",
                  borderRadius: "4px",
                }}
              >
                <img
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "280px",
                    objectFit: "cover",
                    display: "block",
                    opacity: 0.9,
                  }}
                />
                <div
                  style={{ padding: "16px 18px", background: "var(--white)" }}
                >
                  <p
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      letterSpacing: "1.8px",
                      color: "#666",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Gallery {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: "800",
                      lineHeight: "1.4",
                    }}
                  >
                    {labels[index % labels.length]}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div
            className="center-btn-wrap"
            style={{
              textAlign: "center",
              marginTop: "50px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link href={`${basePath}/contact-us`} className="btn-dark">
              BOOK A VISIT
            </Link>
            <Link href={`${basePath}/services`} className="btn-outline">
              VIEW TREATMENTS
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block" id="clinic-tour">
        <div className="container block-grid">
          <div className="block-visual slide-up">
            <img
              src={featureImage}
              alt={clinic?.name || "Clinic"}
              className="editorial-img"
              style={{ borderRadius: "4px" }}
            />
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
              Inside The Clinic
            </p>
            <h2 className="block-title" style={{ fontSize: "3rem" }}>
              DESIGNED FOR COMFORT.
            </h2>
            <p className="block-desc">
              Every area is planned to support smooth consultations,
              sterilization-first workflows, and a reassuring patient
              experience.
            </p>
            <ul className="highlight-list" style={{ marginTop: "24px" }}>
              <li>Dedicated consultation and treatment zones</li>
              <li>Structured hygiene and sterilization protocol</li>
              <li>Patient-friendly environment for all age groups</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
