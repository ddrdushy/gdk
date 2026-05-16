import { Section, SectionHeading } from "./section";
import { PassportBooklet } from "@/components/passport/passport-booklet";

export function PassportPreviewSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="The passport"
        title="Trust, made portable."
        subtitle="Every verified participant carries a passport with stamps, badges, and shareable proof. Reusable across programmes, mentors, partners, and regions."
        align="center"
      />

      <div className="mt-14 grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
        <PassportBooklet
          type="startup"
          holderName="MediNova AI"
          subtitle="HealthTech · MVP · Malaysia"
          passportId="TP-ST-2026-001"
          status="Conditionally Verified"
          stamps={[
            { key: "identity-verified", status: "earned" },
            { key: "pitch-deck-reviewed", status: "earned" },
            { key: "programme-eligible", status: "earned" },
            { key: "pilot-ready", status: "pending" },
            { key: "compliance-reviewed", status: "pending" },
            { key: "funding-ready", status: "locked" },
          ]}
        />
        <PassportBooklet
          type="mentor"
          holderName="Dr. Sarah Lim"
          subtitle="HealthTech · Compliance · Malaysia"
          passportId="TP-MN-2026-014"
          status="Verified Mentor"
          stamps={[
            { key: "identity-verified", status: "earned" },
            { key: "expertise-verified", status: "earned" },
            { key: "mentor-approved", status: "earned" },
            { key: "high-impact-mentor", status: "earned" },
          ]}
        />
      </div>
    </Section>
  );
}
