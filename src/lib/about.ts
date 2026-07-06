export type Job = { years: string; role: string; co: string; desc: string };
export type SkillGroup = { label: string; items: string[] };
// export type Testimonial = { quote: string; initials: string; name: string; role: string };

export const bio = [
  "I'm a full-stack engineer with a platform habit. I build and maintain the systems that keep products running, and I enjoy mentoring and helping teams ship better software.",
  "Outside work: maintaining cashtrakd, writing monthly-ish, and slowly over-engineering a home lab.",
];

export const jobs: Job[] = [
  {
    years: "2023 — 2026",
    role: "Full-stack Web Developer",
    co: "Best Cigar Prices",
    desc: "Built features and maintained a high-traffic e-commerce platform, as well as the associated backend services. Designed, built, and improved legacy internal backend systems. Worked across the stack: PHP, CodeIgniter, JavaScript, Linux VM, PostgreSQL, and AWS.",
  }
];

export const skillGroups: SkillGroup[] = [
  {
    label: "languages",
    items: ["PHP", "TypeScript", "JavaScript", "Go", "Python", "SQL", "Bash"]
  },
  {
    label: "backend",
    items: ["Laravel", "Node.js", "REST APIs", "Postgres"]
  },
  {
    label: "frontend",
    items: ["React", "Next.js", "Tailwind CSS", "shadcn/ui"]
  },
  {
    label: "infra & devops",
    items: ["Docker", "AWS (ECR, Fargate)", "GitHub Actions", "Terraform"],
  },
];

// export const testimonials: Testimonial[] = [
//   {
//     quote:
//       "Dom is the engineer you hand the scary migration to. He shipped our platform rewrite ahead of schedule and documented it so well we barely noticed he'd left.",
//     initials: "MK",
//     name: "Maya Krishnan",
//     role: "Engineering Manager, Ferrostat",
//   },
//   {
//     quote:
//       "Rare combination: cares about pixel-level frontend polish and argues persuasively about Kubernetes resource limits. Made everyone around him better.",
//     initials: "JT",
//     name: "Jonas Thal",
//     role: "CTO, Relay (client)",
//   },
// ];
