import { readSourceConfig } from "@/lib/dataBuilder";
import { notFound } from "next/navigation";
import Link from "next/link";

type ServiceDetail = {
  summary: string;
  benefits: string[];
};

function getServiceDetail(service: string): ServiceDetail {
  const lower = service.toLowerCase();

  if (lower.includes("implant")) {
    return {
      summary:
        "Structured implant planning focused on long-term stability, function, and aesthetics.",
      benefits: [
        "3D diagnostic planning",
        "Precise placement workflow",
        "Long-term maintenance guidance",
      ],
    };
  }

  if (lower.includes("align") || lower.includes("orthodont")) {
    return {
      summary:
        "Alignment-focused treatment pathways to improve bite, comfort, and smile confidence.",
      benefits: [
        "Personalized correction roadmap",
        "Progressive adjustment reviews",
        "Retention and follow-up protocol",
      ],
    };
  }

  if (lower.includes("root canal") || lower.includes("endodont")) {
    return {
      summary:
        "Pain-relief centered treatment with infection control and preservation of natural structure.",
      benefits: [
        "Detailed diagnosis and imaging",
        "Comfort-first treatment execution",
        "Post-procedure restoration planning",
      ],
    };
  }

  if (lower.includes("cosmetic") || lower.includes("smile")) {
    return {
      summary:
        "Aesthetic improvements designed around your facial profile, goals, and natural expression.",
      benefits: [
        "Smile design consultation",
        "Natural-looking materials",
        "Outcome-focused finishing",
      ],
    };
  }

  if (lower.includes("clean") || lower.includes("prevent")) {
    return {
      summary:
        "Preventive care designed to reduce long-term complications and protect oral health.",
      benefits: [
        "Routine examination workflow",
        "Plaque and tartar management",
        "Customized home-care advice",
      ],
    };
  }

  return {
    summary:
      "Personalized treatment planning with clear communication and measurable clinical outcomes.",
    benefits: [
      "Consultation and case assessment",
      "Tailored treatment planning",
      "Follow-up care and monitoring",
    ],
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/template4/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { clinic, business } = data;

  const activeServices = business?.services?.length
    ? business.services
    : [
        "General Dentistry",
        "Cosmetic Dentistry",
        "Dental Implants",
        "Braces & Aligners",
      ];

  const reviewCount = business?.reviewCount || "500+";
  const rating = business?.rating || "4.9";

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
            SERVICES
          </p>
          <h1
            className="massive-text"
            style={{
              fontSize: "4.5rem",
              lineHeight: "0.9",
              paddingBottom: "20px",
            }}
          >
            OUR SERVICES
          </h1>
          <p className="hero-subtext">
            {business?.description ||
              "Explore a complete set of treatment options designed around long-term oral health and patient comfort."}
          </p>
        </div>
      </section>

      <section
        className="section-block"
        id="service-stats"
        style={{ paddingTop: "30px" }}
      >
        <div className="container">
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-big">{activeServices.length}+</span>
              <span className="stat-label">ACTIVE TREATMENTS</span>
            </div>
            <div className="stat-item">
              <span className="stat-big">{rating}</span>
              <span className="stat-label">AVERAGE RATING</span>
            </div>
            <div className="stat-item">
              <span className="stat-big">{reviewCount}</span>
              <span className="stat-label">PATIENT REVIEWS</span>
            </div>
            <div className="stat-item">
              <span className="stat-big">100%</span>
              <span className="stat-label">FOCUS ON QUALITY</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block bg-light" id="treatments">
        <div className="container">
          <div
            className="section-header-center slide-up"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 className="block-title">TREATMENT ROADMAPS.</h2>
            <p
              className="section-subtitle"
              style={{
                fontSize: "1.25rem",
                color: "#555",
                maxWidth: "860px",
                margin: "0 auto",
              }}
            >
              Every service includes diagnostic review, personalized planning,
              and follow-up guidance.
            </p>
          </div>

          <div className="programs-grid">
            {activeServices.map((service: string, index: number) => {
              const detail = getServiceDetail(service);

              return (
                <div
                  className="program-card slide-up"
                  key={index}
                  style={{ transitionDelay: `${(index % 3) * 100}ms` }}
                >
                  <div
                    className={
                      index % 2 === 0 ? "program-header" : "program-header dark"
                    }
                  >
                    <h3 style={{ fontSize: "1.3rem" }}>
                      {service.toUpperCase()}
                    </h3>
                    <span
                      className={
                        index % 2 === 0
                          ? "program-badge"
                          : "program-badge dark-badge"
                      }
                    >
                      PLAN
                    </span>
                  </div>
                  <div style={{ padding: "30px" }}>
                    <p
                      style={{
                        color: "#444",
                        lineHeight: "1.6",
                        marginBottom: "20px",
                      }}
                    >
                      {detail.summary}
                    </p>
                    <ul
                      className="program-features"
                      style={{ padding: "0 0 0 6px", margin: 0 }}
                    >
                      {detail.benefits.map(
                        (point: string, pointIndex: number) => (
                          <li
                            key={pointIndex}
                            style={{
                              marginBottom:
                                pointIndex === detail.benefits.length - 1
                                  ? 0
                                  : "14px",
                            }}
                          >
                            {point}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
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
              BOOK CONSULTATION
            </Link>
            <Link href={`${basePath}`} className="btn-outline">
              BACK TO HOME
            </Link>
          </div>
        </div>
      </section>

      <section
        className="section-block"
        style={{ backgroundColor: "var(--black)", color: "var(--white)" }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2
            className="massive-text"
            style={{
              fontSize: "3.3rem",
              lineHeight: 1,
              marginBottom: "16px",
              color: "var(--white)",
            }}
          >
            NEED A PERSONALIZED PLAN?
          </h2>
          <p
            style={{
              color: "#bdbdbd",
              maxWidth: "780px",
              margin: "0 auto 28px",
              fontSize: "1.1rem",
            }}
          >
            Talk to our team at {clinic?.name || "the clinic"} and get a
            treatment plan built around your priorities.
          </p>
          <Link
            href={`${basePath}/contact-us`}
            className="btn-outline"
            style={{ color: "var(--white)", borderColor: "var(--white)" }}
          >
            CONTACT OUR TEAM
          </Link>
        </div>
      </section>
    </div>
  );
}
