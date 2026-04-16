import { readSourceConfig } from "@/lib/dataBuilder";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function AboutUsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/template4/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, doctor, business, media } = data;
  const doctorImage =
    doctor?.images?.[0] ||
    media?.otherImages?.[0] ||
    media?.clinicImages?.[1] ||
    "/images/founders.jpg";
  const clinicImage =
    media?.clinicImages?.[0] ||
    media?.treatmentImages?.[0] ||
    media?.otherImages?.[0] ||
    "/images/dental_hero.webp";

  const highlights = business?.highlights?.length
    ? business.highlights.slice(0, 4)
    : [
        "Experienced specialists",
        "Advanced treatment systems",
        "Patient-first communication",
        "Consistent quality standards",
      ];

  const focusAreas = business?.services?.length
    ? business.services.slice(0, 6)
    : [
        "General Dentistry",
        "Cosmetic Dentistry",
        "Dental Implants",
        "Orthodontic Care",
        "Preventive Care",
        "Restorative Treatments",
      ];

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
            ABOUT US
          </p>
          <h1
            className="massive-text"
            style={{
              fontSize: "4.5rem",
              lineHeight: "0.9",
              paddingBottom: "20px",
            }}
          >
            OUR STORY
          </h1>
          <p className="hero-subtext">
            Learn what drives {clinic?.name || "our clinic"}, how our team
            approaches care, and why patients trust us with long-term oral
            health.
          </p>
        </div>
      </section>

      <section className="section-block" id="about">
        <div className="container block-grid">
          <div
            className="block-visual slide-up"
            style={{ transitionDelay: "200ms" }}
          >
            <img
              src={clinicImage}
              alt="Clinic facility"
              className="editorial-img"
              style={{ borderRadius: "4px" }}
            />
          </div>
          <div className="block-content slide-up">
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
              Who We Are
            </p>
            <h2
              className="block-title"
              style={{ fontSize: "3rem", marginBottom: "30px" }}
            >
              BUILT ON TRUST
            </h2>
            <p className="block-desc">
              {clinic.description ||
                "Our mission is to provide outstanding, reliable care."}
            </p>
            <p className="block-desc" style={{ marginTop: "20px" }}>
              We combine modern clinical methods with clear communication so
              every patient understands their options and feels confident with
              each treatment decision.
            </p>
            <p className="block-desc" style={{ marginBottom: 0 }}>
              From preventive checkups to advanced procedures, we focus on
              consistent outcomes, patient comfort, and long-term oral health
              results.
            </p>
          </div>
        </div>
      </section>

      <section className="section-block bg-light" id="values">
        <div className="container">
          <div
            className="section-header-center slide-up"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 className="block-title">WHAT DEFINES US.</h2>
            <p
              className="section-subtitle"
              style={{
                fontSize: "1.25rem",
                color: "#555",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              These are the standards we apply to every consultation, treatment
              plan, and follow-up review.
            </p>
          </div>

          <div className="vault-grid slide-up">
            {highlights.map((item: string, index: number) => (
              <div className="vault-item" key={index}>
                <p className="mini-label" style={{ marginBottom: "12px" }}>
                  0{index + 1}
                </p>
                <h3
                  style={{
                    fontSize: "1.45rem",
                    fontWeight: "900",
                    marginBottom: "10px",
                    lineHeight: "1.3",
                    textTransform: "uppercase",
                  }}
                >
                  {item}
                </h3>
                <p style={{ color: "#555", lineHeight: "1.6" }}>
                  Practical, evidence-based care that prioritizes safety,
                  comfort, and measurable outcomes.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block" id="specialist">
        <div className="container block-grid">
          <div className="block-visual slide-up">
            <img
              src={doctorImage}
              alt={doctor?.name || "Lead Dentist"}
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
              Clinical Leadership
            </p>
            <h2
              className="block-title"
              style={{ fontSize: "3rem", marginBottom: "15px" }}
            >
              {doctor?.name?.toUpperCase() || "LEAD CLINICIAN"}
            </h2>
            <p
              className="block-desc"
              style={{
                fontWeight: "700",
                color: "#333",
                fontSize: "1.2rem",
                marginBottom: "25px",
                letterSpacing: "1px",
              }}
            >
              {doctor?.specialization || "Comprehensive Dental Care"} •{" "}
              {doctor?.experience || "10+ years"}
            </p>
            <p className="block-desc" style={{ lineHeight: "1.8" }}>
              {doctor?.about ||
                "A dedicated professional focused on high-quality diagnostics, clear patient guidance, and consistent treatment outcomes."}
            </p>
            <div style={{ marginTop: "50px" }}>
              <h4
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "900",
                  letterSpacing: "1px",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                }}
              >
                CORE FOCUS AREAS
              </h4>
              <ul
                className="highlight-list"
                style={{ listStyle: "none", padding: 0, margin: 0 }}
              >
                {focusAreas.map((sp: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      padding: "12px 0",
                      borderBottom: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontWeight: "700" }}>{sp}</span>
                  </li>
                ))}
              </ul>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "30px",
                }}
              >
                <Link href={`${basePath}/services`} className="btn-dark">
                  VIEW SERVICES
                </Link>
                <Link href={`${basePath}/contact-us`} className="btn-outline">
                  CONTACT TEAM
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
