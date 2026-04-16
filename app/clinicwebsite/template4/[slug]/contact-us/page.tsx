import { readSourceConfig } from "@/lib/dataBuilder";
import { notFound } from "next/navigation";
import Link from "next/link";

type TimingRow = {
  label: string;
  value: string;
};

function normalizeWebsite(url: string | undefined): string | null {
  if (!url) return null;
  const value = url.trim();
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://${value}`;
}

function buildTimingRows(rawTimings: unknown): TimingRow[] {
  if (Array.isArray(rawTimings) && rawTimings.length > 0) {
    return rawTimings.map((item, index) => {
      if (typeof item === "string") {
        const clean = item.trim();
        const parts = clean.split(":");
        if (parts.length > 1) {
          return {
            label: parts[0].trim(),
            value: parts.slice(1).join(":").trim() || "Open",
          };
        }
        return {
          label: `Day ${index + 1}`,
          value: clean || "Open",
        };
      }

      if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const label =
          (typeof record.day === "string" && record.day) ||
          (typeof record.label === "string" && record.label) ||
          `Day ${index + 1}`;

        const open = typeof record.open === "string" ? record.open : "";
        const close = typeof record.close === "string" ? record.close : "";
        const time = typeof record.time === "string" ? record.time : "";

        return {
          label,
          value: [open, close].filter(Boolean).join(" - ") || time || "Open",
        };
      }

      return {
        label: `Day ${index + 1}`,
        value: "Open",
      };
    });
  }

  return [
    { label: "Monday - Friday", value: "9:00 AM - 7:00 PM" },
    { label: "Saturday", value: "9:00 AM - 5:00 PM" },
    { label: "Sunday", value: "By appointment" },
  ];
}

export default async function ContactUsPage({
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
  const waphone = clinic.contact?.phone?.replace(/\D/g, "") || "919751396117";
  const watext = `Hi, I'm interested in booking a consultation at ${clinic.name || "your clinic"}!`;
  const walink = `https://wa.me/${waphone}?text=${encodeURIComponent(watext)}`;
  const mapsLink = `https://maps.google.com/?q=${encodeURIComponent(clinic.address?.full || "")}`;
  const websiteHref = normalizeWebsite(clinic.contact?.website);
  const timingRows = buildTimingRows(business?.timings);

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
            CONTACT US
          </p>
          <h1
            className="massive-text"
            style={{
              fontSize: "4.5rem",
              lineHeight: "0.9",
              paddingBottom: "20px",
            }}
          >
            CONTACT US
          </h1>
          <p className="hero-subtext">
            Reach our team for appointments, treatment questions, or visit
            assistance.
          </p>
        </div>
      </section>

      <section className="section-block bg-light" id="details">
        <div className="container block-grid">
          <div className="block-content slide-up">
            <div style={{ marginBottom: "50px" }}>
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
                Location
              </p>
              <h2
                className="block-title"
                style={{ fontSize: "2.5rem", marginBottom: "15px" }}
              >
                {clinic?.name?.toUpperCase() || "OUR CLINIC"}
              </h2>
              <p
                className="block-desc"
                style={{ fontSize: "1.3rem", color: "#444" }}
              >
                {clinic.address?.full || ""}
              </p>
              <p className="block-desc" style={{ marginTop: "10px" }}>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                  style={{
                    display: "inline-block",
                    marginTop: "10px",
                    fontSize: "0.9rem",
                    padding: "10px 20px",
                  }}
                >
                  GET DIRECTIONS
                </a>
              </p>
            </div>

            <div style={{ marginBottom: "50px" }}>
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
                Direct Contact
              </p>
              <p
                className="block-desc"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  color: "var(--black)",
                  marginBottom: "5px",
                }}
              >
                {clinic.contact?.phone || ""}
              </p>
              {websiteHref ? (
                <p
                  className="block-desc"
                  style={{ fontSize: "1.1rem", color: "#666" }}
                >
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    {websiteHref.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              ) : null}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href={`tel:${clinic.contact?.phone || ""}`}
                className="btn-dark"
              >
                CALL NOW
              </a>
              <a
                href={walink}
                target="_blank"
                rel="noreferrer"
                className="btn-outline"
              >
                WHATSAPP
              </a>
            </div>
          </div>

          <div
            className="block-visual slide-up"
            style={{ transitionDelay: "200ms" }}
          >
            <div
              className="program-card"
              style={{
                height: "100%",
                background: "var(--white)",
                padding: "50px",
              }}
            >
              <div
                className="program-header"
                style={{
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "20px",
                  marginBottom: "30px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "900",
                    letterSpacing: "1px",
                  }}
                >
                  WORKING HOURS
                </h3>
              </div>
              <ul
                className="program-features"
                style={{ listStyle: "none", padding: 0 }}
              >
                {timingRows.map((item: TimingRow, i: number) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <strong style={{ color: "var(--black)" }}>
                      {item.label}
                    </strong>
                    <span style={{ color: "#666", fontWeight: "500" }}>
                      {item.value}
                    </span>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: "26px" }}>
                <p
                  style={{
                    color: "#555",
                    lineHeight: "1.6",
                    marginBottom: "16px",
                  }}
                >
                  Need help before your first visit? Check our preparation notes
                  and common patient guidance.
                </p>
                <Link
                  href={`${basePath}/patient-guides`}
                  className="btn-outline"
                >
                  PATIENT GUIDES
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
