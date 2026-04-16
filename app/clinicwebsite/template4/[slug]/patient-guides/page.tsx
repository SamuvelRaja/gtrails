import { readSourceConfig } from "@/lib/dataBuilder";
import { notFound } from "next/navigation";
import Link from "next/link";

type Guide = {
  title: string;
  summary: string;
  tips: string[];
};

function getGuideByService(service: string): Guide {
  const lower = service.toLowerCase();

  if (lower.includes("implant")) {
    return {
      title: `${service} Aftercare`,
      summary:
        "Follow-up is essential for long-term stability. Prioritize hygiene, scheduled reviews, and chewing guidance in the first few weeks.",
      tips: [
        "Use soft foods for the first recovery window",
        "Avoid pressure on the treated area",
        "Attend all scheduled post-procedure reviews",
      ],
    };
  }

  if (lower.includes("align") || lower.includes("orthodont")) {
    return {
      title: `${service} Daily Routine`,
      summary:
        "Consistent wear time and hygiene discipline are key to predictable alignment outcomes and reduced discomfort.",
      tips: [
        "Wear appliances for the advised daily duration",
        "Clean trays and teeth after meals",
        "Report persistent pain or fitting issues early",
      ],
    };
  }

  if (lower.includes("root canal") || lower.includes("endodont")) {
    return {
      title: `${service} Recovery Guide`,
      summary:
        "Mild tenderness can occur temporarily. Focus on medication compliance and restoration follow-up for complete healing.",
      tips: [
        "Take medication exactly as prescribed",
        "Avoid hard chewing on treated side initially",
        "Return for crown/restoration if advised",
      ],
    };
  }

  if (lower.includes("clean") || lower.includes("prevent")) {
    return {
      title: `${service} Maintenance`,
      summary:
        "Preventive appointments work best with consistent home-care habits and timely re-evaluation cycles.",
      tips: [
        "Brush twice daily with proper technique",
        "Floss or use interdental cleaning tools",
        "Book periodic preventive checkups",
      ],
    };
  }

  return {
    title: `${service} Guidance`,
    summary:
      "Understand preparation steps, procedure expectations, and post-treatment habits for smoother outcomes.",
    tips: [
      "Confirm pre-visit instructions in advance",
      "Ask questions about recovery and timeline",
      "Track any symptoms and report concerns early",
    ],
  };
}

export default async function PatientGuidesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const basePath = `/clinicwebsite/template4/${slug}`;

  const data = await readSourceConfig(slug);
  if (!data) return notFound();

  const { business } = data;

  const services = business?.services?.length
    ? business.services.slice(0, 6)
    : [
        "General Checkup",
        "Dental Implants",
        "Root Canal Treatment",
        "Braces & Aligners",
      ];

  const guidesData = services.map((service: string) =>
    getGuideByService(service),
  );

  const quickRules = business?.highlights?.length
    ? business.highlights.slice(0, 3)
    : [
        "Follow recommended treatment timelines",
        "Maintain consistent oral hygiene",
        "Reach out early for any discomfort",
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
            GUIDES
          </p>
          <h1
            className="massive-text"
            style={{
              fontSize: "4.5rem",
              lineHeight: "0.9",
              paddingBottom: "20px",
            }}
          >
            PATIENT GUIDES
          </h1>
          <p className="hero-subtext">
            Clear, practical guidance before and after treatment so you always
            know what to expect.
          </p>
        </div>
      </section>

      <section className="section-block bg-light" id="guides">
        <div className="container">
          <div
            className="section-header-center slide-up"
            style={{ textAlign: "center", marginBottom: "60px" }}
          >
            <h2 className="block-title">CARE INSTRUCTIONS.</h2>
            <p
              className="section-subtitle"
              style={{
                fontSize: "1.25rem",
                color: "#555",
                maxWidth: "860px",
                margin: "0 auto",
              }}
            >
              Each treatment comes with specific guidance for preparation,
              recovery, and long-term success.
            </p>
          </div>

          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            {guidesData.map((guide: Guide, index: number) => (
              <div
                className="program-card slide-up"
                key={index}
                style={{
                  transitionDelay: `${(index % 4) * 100}ms`,
                  marginBottom: "30px",
                  background: "var(--white)",
                }}
              >
                <div
                  className={
                    index % 2 === 0 ? "program-header" : "program-header dark"
                  }
                >
                  <h3 style={{ fontSize: "1.3rem" }}>
                    {guide.title.toUpperCase()}
                  </h3>
                  <span
                    className={
                      index % 2 === 0
                        ? "program-badge"
                        : "program-badge dark-badge"
                    }
                  >
                    GUIDE {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div style={{ padding: "30px" }}>
                  <p
                    style={{
                      color: "#555",
                      lineHeight: "1.7",
                      fontSize: "1.05rem",
                      marginBottom: "18px",
                    }}
                  >
                    {guide.summary}
                  </p>

                  <ul
                    className="program-features"
                    style={{ padding: "0 0 0 6px", margin: 0 }}
                  >
                    {guide.tips.map((tip: string, tipIndex: number) => (
                      <li
                        key={tipIndex}
                        style={{
                          marginBottom:
                            tipIndex === guide.tips.length - 1 ? 0 : "12px",
                        }}
                      >
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="vault-grid slide-up" style={{ marginTop: "30px" }}>
            {quickRules.map((rule: string, index: number) => (
              <div className="vault-item" key={index}>
                <p className="mini-label" style={{ marginBottom: "12px" }}>
                  RULE {String(index + 1).padStart(2, "0")}
                </p>
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 900,
                    lineHeight: 1.4,
                  }}
                >
                  {rule}
                </h3>
              </div>
            ))}
          </div>

          <div
            className="center-btn-wrap slide-up"
            style={{
              textAlign: "center",
              marginTop: "60px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link href={`${basePath}/contact-us`} className="btn-dark">
              CONTACT OUR TEAM
            </Link>
            <Link href={`${basePath}/services`} className="btn-outline">
              VIEW SERVICES
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
