// Content for sailkcaj.com. Edit these arrays to update the site — add a
// role, project, or media credit here and it automatically gets a matching
// photo box in `npm run photos` too, no other file needs to change.
import { slugify } from './slugify.js';

export const stats = [
  { label: 'Companies', value: '7+', icon: 'ti-briefcase' },
  { label: 'Finished', value: '100mi', subtitle: 'ultramarathon', icon: 'ti-run' },
  { label: 'Countries', value: '41+', icon: 'ti-plane' },
  { label: 'Apps Built', value: '8+', icon: 'ti-code' },
];

export const roles = [
  {
    title: 'Risk Analyst Intern',
    company: 'Morgan Stanley',
    location: 'Glasgow',
    dates: 'Jun 2026 - Sep 2026',
    description: 'Synthesized real-time OSINT data and built agentic AI workflows to model macroeconomic and geopolitical shocks, and investigated trading behavior across global markets',
    tags: ['AI/ML', 'Finance', 'OSINT'],
  },
  {
    title: 'Software Engineer',
    company: 'Radsuite',
    location: 'Dallas',
    dates: 'Dec 2025 - Apr 2026',
    description: 'Architected a self-hosted GitLab platform and a cross-LLM collaboration tool; cut environment setup time 80% with reproducible, one-command deploys',
    tags: ['DevOps', 'LLM', 'Docker'],
  },
  {
    title: 'Software Engineer',
    company: 'Tenora',
    location: 'London',
    dates: 'Sep 2025 - Dec 2025',
    description: 'Built a 12-month FX Cash-Flow-at-Risk model using Monte Carlo simulation, plus an AI image-to-CSV pipeline that cut data entry time 95%',
    tags: ['ML', 'Finance', 'Python'],
  },
  {
    title: 'AI & Automation Intern',
    company: 'LexTrack AI',
    location: 'New York',
    dates: 'Jun 2025 - Sep 2025',
    description: 'Deployed ML models across 10,000+ legal documents, improving extraction speed 60% and cutting contract review time 40%',
    tags: ['ML', 'Legal', 'Python'],
  },
  {
    title: 'Engineering Intern',
    company: 'Plantforce Ltd',
    location: 'Bristol',
    dates: 'Jun 2024 - Sep 2024',
    description: 'Designed and prototyped 24 CAD components now deployed 4,000+ times; cut waste 20% via lean/JIT and lifted output 8% through probability analysis',
    tags: ['CAD', 'Engineering', 'Lean'],
  },
];

export const education = {
  school: 'University of Manchester',
  degree: 'BSc Mathematics with Finance',
  detail: 'GPA 4.0 · A-Levels: Maths (A*), Economics (A), Business (A)',
};

export const projects = [
  {
    name: 'Eiliad',
    tagline: 'QR-based payments & instant refunds for independent retailers',
    status: 'Active',
    tech: ['Node.js', 'React', 'Stripe', 'PostgreSQL'],
    highlight: true,
  },
  {
    name: 'Postinvested',
    tagline: 'Content platform - grew to 130+ posts, 35% price increase, users across 9 countries',
    tech: ['Growth', 'Platform'],
  },
  {
    name: 'Financial Algorithm',
    tagline: 'R-based stock trend model, profitable 9 of 11 months, presented at the London Investors Show',
    tech: ['R', 'ggplot2', 'Trading'],
  },
  {
    name: 'GOLLM',
    tagline: 'LLM for gene ontology summarization, built at the Cambridge BioHackathon and featured in a published paper',
    tech: ['LLM', 'Bioinformatics'],
  },
  {
    name: 'FX Cash-Flow-at-Risk Model',
    tagline: 'Monte Carlo simulation for currency exposure analysis',
    tech: ['Python', 'Finance', 'Risk'],
  },
];

export const mediaCredits = [
  { title: 'The Witcher', role: 'Actor', platform: 'Netflix', description: 'Season 2' },
  { title: 'Higher Ground', role: 'Actor', platform: 'Film' },
  { title: 'Maxton Hall', role: 'Actor', platform: 'Prime Video' },
  { title: 'The Mandalorian', role: 'Actor', platform: 'Disney+', description: 'Star Wars' },
  { title: 'John Lewis', role: 'Model', description: '2025 Christmas advert' },
  { title: 'Tom Ford', role: 'Model', description: 'Campaign' },
  { title: 'BoohooMAN', role: 'Model', description: '2024 film collection' },
  { title: 'Manchester City', role: 'Model', description: '2025 collection' },
];

export const achievements = [
  {
    title: 'Morgan Stanley Future Generations Scholarship',
    description: '1 of 25 awarded globally to exceptional undergraduates',
    year: '2026',
  },
  {
    title: '100-Mile Ultramarathon',
    description: '27:38 finish time, 3,682m elevation gain',
    year: '2025',
  },
  {
    title: '17th Place, Umushroom Investment Competition',
    description: '84% return over 2 months, 1,000+ teams',
    year: '2024',
  },
  {
    title: 'J.P. Morgan Investment Banking Programme',
    description: 'Built a DCF model and analyzed capital structure dynamics for an M&A transaction',
  },
  {
    title: 'BDO Voice of the Future Challenge',
    description: 'Winner',
    year: '2023',
  },
];

// Photo slots. `npm run photos` (tools/photo-tool) reads these same helpers
// so every slot it shows always matches exactly what the site renders.
export const HERO_IMAGE = '/images/hero.jpg';
export const companyLogoSrc = (company) => `/images/companies/${slugify(company)}.jpg`;
export const projectImageSrc = (name) => `/images/projects/${slugify(name)}.jpg`;
export const mediaImageSrc = (title) => `/images/media/${slugify(title)}.jpg`;
