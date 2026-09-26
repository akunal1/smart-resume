export const PROFILE = {
  name: "Avinash Nayak",
  role: "Web & Mobile Architect",
  location: "Bengaluru, India",
  timeZone: "Asia/Kolkata",
  email: "avinash.nayak02@outlook.com",
  linkedin: "https://www.linkedin.com/in/avinash-nayak02/",
  github: "https://github.com/akunal1",
  website: "https://avinashnayak.in/",
  resume: "/Avinash_Nayak.pdf",
  assistant: "/assistant",
  availability: "Open to new opportunities",
};

const CAREER_START = new Date(2015, 9, 1);
export const YEARS_EXPERIENCE = Math.floor(
  (Date.now() - CAREER_START.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
);

export type CaseId = "ao" | "agco" | "gst" | "commerce" | "utility" | "iot";
export type CaseKind = "Mobile" | "Web" | "Research";

export interface CaseStudy {
  id: CaseId;
  title: string;
  client: string;
  kind: CaseKind;
  year: string;
  role: string;
  platform: string;
  image: string;
  tagline: string;
  problem: string;
  approach: string;
  challenges: { title: string; body: string }[];
  architecture: string[];
  stack: string[];
  outcome: string[];
}

export const CASES: CaseStudy[] = [
  {
    id: "ao",
    title: "Australian Open 2020",
    client: "Tennis Australia · via Infosys",
    kind: "Mobile",
    year: "2019—20",
    role: "Mobile developer, onsite in Australia",
    platform: "iOS & Android · React Native",
    image: "/AO-banner.jpg",
    tagline:
      "The official app of a Grand Slam: live scores, draws and order of play for fans around the world, during two weeks of peak traffic.",
    problem:
      "A Grand Slam lives and dies on live data. For two weeks, fans everywhere expect scores, draws and schedules to update the moment a point is won, on every kind of device, on stadium Wi-Fi and on patchy mobile networks alike.",
    approach:
      "A React Native app for iOS and Android, with Redux-Saga orchestrating live data channels into a normalised Redux store. Screens subscribe only to the slices they render, so a score change on one court never re-renders the rest of the draw.",
    challenges: [
      {
        title: "Live data without jank",
        body: "Frequent updates had to land without dropping frames in long, scrolling lists. Normalised entities and memoised selectors kept rendering work proportional to what actually changed.",
      },
      {
        title: "Lifecycle-aware live channels",
        body: "Saga-managed channels start, pause and resume with app state and screen focus, keeping data fresh without draining battery or hammering APIs in the background.",
      },
      {
        title: "A deadline that doesn't move",
        body: "The tournament starts on a fixed date. Scope, testing and release were planned backwards from the first serve.",
      },
    ],
    architecture: ["Live tournament APIs", "Saga channels", "Normalised store", "Memoised selectors", "Native UI"],
    stack: ["React Native", "Redux", "Redux-Saga", "REST APIs"],
    outcome: [
      "Shipped as the official Australian Open 2020 app",
      "Live scores, draws and schedules for a worldwide audience",
      "Built onsite alongside the client team in Australia",
    ],
  },
  {
    id: "agco",
    title: "Offline-first field operations",
    client: "AGCO Corporation",
    kind: "Mobile",
    year: "2022—now",
    role: "Senior developer",
    platform: "React Native · Realm · Mapbox",
    image: "/agco.png",
    tagline: "Mobile software for agriculture that keeps working where the network doesn't.",
    problem:
      "Farms don't come with 5G. Operators and technicians work across wide fields and remote sites where connectivity can drop for hours, and losing a single record means lost work, lost trust or a wasted trip.",
    approach:
      "Offline is the default state, not an error. Every read and write goes to a local Realm database first. A saga-driven sync queue pushes changes up and pulls updates down whenever a connection appears, and Mapbox provides field-level maps.",
    challenges: [
      {
        title: "Sync you can trust",
        body: "Queued mutations, retries with backoff and deterministic conflict handling keep local and server state consistent after long offline stretches.",
      },
      {
        title: "Maps in the middle of nowhere",
        body: "Mapbox-powered map experiences give field-level context and are designed to stay useful when tiles can't be fetched live.",
      },
      {
        title: "Quality that scales with the team",
        body: "Code reviews, mentoring and shared patterns across an international team, so standards hold as more people contribute.",
      },
    ],
    architecture: ["Native UI", "Redux Toolkit", "Realm · local-first", "Sync queue", "Cloud APIs"],
    stack: ["React Native", "TypeScript", "Redux Toolkit", "Redux-Saga", "Realm", "Mapbox"],
    outcome: [
      "Core workflows run with zero connectivity",
      "Contributing to the digitalisation of agriculture",
      "Mentoring developers and driving code-quality initiatives",
    ],
  },
  {
    id: "gst",
    title: "India's indirect-tax portal",
    client: "National tax programme · via Infosys",
    kind: "Web",
    year: "2015—19",
    role: "Systems engineer",
    platform: "Web · AngularJS",
    image: "/gst.png",
    tagline: "The front end of one of the largest and most complex tax systems in the world.",
    problem:
      "A nationwide indirect-tax reform meant millions of businesses, from large enterprises to small traders, would register, file and pay through a single portal. The forms are long, the rules are dense and mistakes are expensive.",
    approach:
      "A modular AngularJS front end with reusable, rule-driven form components and validation, responsive layouts for the devices businesses actually use, and active involvement in architecture and design decisions.",
    challenges: [
      {
        title: "Complex forms, simple experience",
        body: "Multi-step returns with many interdependent fields, broken into guided steps with inline validation.",
      },
      {
        title: "Built for national scale",
        body: "Pages had to stay responsive under very heavy traffic around filing deadlines.",
      },
      {
        title: "Consistency across a huge surface",
        body: "Shared components and patterns kept a very large number of screens consistent across many contributors.",
      },
    ],
    architecture: ["Taxpayer UI", "AngularJS modules", "Validation rules", "Portal services"],
    stack: ["AngularJS", "JavaScript", "Bootstrap", "CSS3"],
    outcome: [
      "Part of the team that delivered India's indirect-tax portal",
      "Dense filings turned into guided, validated flows",
      "Foundations in large-scale enterprise front end",
    ],
  },
  {
    id: "commerce",
    title: "Direct & trade commerce",
    client: "Australian enterprise · via Infosys",
    kind: "Web",
    year: "2020—22",
    role: "Technology analyst",
    platform: "Web · React",
    image: "/laminex.png",
    tagline: "One platform for direct and indirect purchasing, serving customers, trade buyers and distributors.",
    problem:
      "Direct customers and trade buyers purchase in very different ways: pricing, approvals and ordering flows all diverge. The platform had to serve both without turning into two products.",
    approach:
      "A React and Redux-Saga web app with shared building blocks and role-aware flows, styled with a Sass design layer on Bootstrap's grid for fast, consistent responsive layouts.",
    challenges: [
      {
        title: "Two journeys, one codebase",
        body: "Role-aware composition let direct and trade flows share most of their UI while diverging where the business actually differs.",
      },
      {
        title: "Async flows that read clearly",
        body: "Redux-Saga kept multi-step purchase flows (pricing, availability, checkout) declarative and testable.",
      },
      {
        title: "Responsive by default",
        body: "Every screen was designed mobile-up, so trade buyers on-site get the same experience as office buyers.",
      },
    ],
    architecture: ["Storefront UI", "Role-aware flows", "Redux-Saga", "Commerce APIs"],
    stack: ["React", "Redux", "Redux-Saga", "JavaScript", "Sass", "Bootstrap"],
    outcome: [
      "Direct and indirect purchasing on one platform",
      "Delivered for the Australian market from Europe",
      "Reusable patterns for complex purchase flows",
    ],
  },
  {
    id: "utility",
    title: "Utility operations console",
    client: "Edison International subsidiary · via Infosys",
    kind: "Web",
    year: "2020—22",
    role: "Technology analyst",
    platform: "Web · React",
    image: "/sce.png",
    tagline: "Web tooling for the day-to-day operations of a large electric utility.",
    problem:
      "Operations teams at a large electric utility handle dense, business-critical data every day. Their tools need to be dependable, quick to scan and hard to misuse.",
    approach:
      "A React and Redux application with complex business logic isolated in sagas, a clear information hierarchy and consistent components for data-heavy screens.",
    challenges: [
      {
        title: "Dense data, clear screens",
        body: "Information hierarchy and consistent components made heavy operational screens quick to scan.",
      },
      {
        title: "Business logic that scales",
        body: "Keeping complex rules in sagas, out of the views, made behaviour predictable and easy to test.",
      },
      {
        title: "Delivery across continents",
        body: "Delivered from Germany with cross-functional teams spread across several time zones.",
      },
    ],
    architecture: ["Operator UI", "Redux store", "Saga workflows", "Enterprise services"],
    stack: ["React", "Redux", "Redux-Saga", "JavaScript", "Sass", "Bootstrap"],
    outcome: [
      "Business-critical tooling for utility operations",
      "Predictable, testable business logic",
      "Smooth delivery with distributed teams",
    ],
  },
  {
    id: "iot",
    title: "Embedded IoT kitchen monitor",
    client: "Research · IEEE Xplore",
    kind: "Research",
    year: "Undergrad",
    role: "Co-author & engineer",
    platform: "Raspberry Pi · Python",
    image: "/iot.png",
    tagline: "Published research on an embedded web server architecture for internet-based kitchen monitoring.",
    problem:
      "Monitoring appliances and conditions in a kitchen usually needs dedicated hardware plus a cloud service. Could a tiny embedded device serve the whole experience on its own?",
    approach:
      "A Raspberry Pi runs an embedded web server in Python. It reads sensor data and serves a lightweight HTML/CSS dashboard with Google Charts that any browser on the network can open.",
    challenges: [
      {
        title: "Doing more with less",
        body: "Very limited CPU and memory meant every layer, from sampling to serving, had to stay lean.",
      },
      {
        title: "Sensor to screen",
        body: "Near-real-time readings were pushed from hardware to a browser without any external infrastructure.",
      },
      {
        title: "From prototype to paper",
        body: "The architecture and results were documented for peer review and published in IEEE Xplore.",
      },
    ],
    architecture: ["Sensors", "Raspberry Pi", "Embedded web server", "Browser dashboard"],
    stack: ["Python", "Raspberry Pi", "HTML/CSS", "Google Charts"],
    outcome: [
      "Published in IEEE Xplore",
      "Self-hosted monitoring with no cloud dependency",
      "An early start in systems thinking",
    ],
  },
];

export interface Chapter {
  id: string;
  years: string;
  country: string;
  flag: "in" | "au" | "de";
  city: string;
  utc: string;
  company: string;
  role: string;
  summary: string;
  highlights: string[];
  stack: string[];
  cases: CaseId[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: "india",
    years: "2015—19",
    country: "India",
    flag: "in",
    city: "Home base",
    utc: "UTC+5:30",
    company: "Infosys",
    role: "Systems Engineer → Senior Systems Engineer",
    summary:
      "Started where scale and correctness are non-negotiable: building the front end of India's indirect-tax portal.",
    highlights: [
      "Complex AngularJS applications for government systems",
      "Responsive design for very high-traffic pages",
      "Took part in architecture and design decisions",
    ],
    stack: ["AngularJS", "JavaScript", "Bootstrap", "CSS3"],
    cases: ["gst"],
  },
  {
    id: "australia",
    years: "2019—20",
    country: "Australia",
    flag: "au",
    city: "Onsite",
    utc: "UTC+10",
    company: "Infosys · Tennis Australia",
    role: "Senior Systems Engineer",
    summary:
      "Moved onsite to build the official Australian Open 2020 app with the client team: live data, a fixed deadline and a global audience.",
    highlights: [
      "Built live game details and scoring experiences",
      "Tuned performance for heavy tournament traffic",
      "Gathered requirements directly with the client",
    ],
    stack: ["React Native", "Redux", "Redux-Saga"],
    cases: ["ao"],
  },
  {
    id: "germany",
    years: "2020—22",
    country: "Germany",
    flag: "de",
    city: "Onsite",
    utc: "UTC+1",
    company: "Infosys",
    role: "Technology Analyst",
    summary:
      "Delivered web platforms for a US electric utility and an Australian commerce business from Europe, with teams spread across several time zones.",
    highlights: [
      "Web apps for an Edison International subsidiary",
      "Responsive commerce platform for the Australian market",
      "Onsite customer coordination and delivery",
    ],
    stack: ["React", "Redux", "Redux-Saga", "Sass"],
    cases: ["utility", "commerce"],
  },
  {
    id: "agco",
    years: "2022—now",
    country: "India",
    flag: "in",
    city: "Bengaluru",
    utc: "UTC+5:30",
    company: "AGCO Corporation",
    role: "Senior Developer",
    summary:
      "Back in Bengaluru, helping digitise agriculture with offline-first mobile architecture for a global machinery manufacturer.",
    highlights: [
      "Offline-first architecture on Realm",
      "Mentoring and code-quality initiatives",
      "Product work with international teams",
    ],
    stack: ["React Native", "TypeScript", "Redux Toolkit", "Realm", "Mapbox"],
    cases: ["agco"],
  },
];

export type Tier = "Core" | "Shipped" | "Exploring";

export interface Tech {
  name: string;
  tier: Tier;
  note: string;
  cases: CaseId[];
  alsoIn?: string;
}

export interface TechGroup {
  id: string;
  label: string;
  blurb: string;
  items: Tech[];
}

export const STACK: TechGroup[] = [
  {
    id: "mobile",
    label: "Mobile",
    blurb: "Cross-platform apps that feel native and survive the real world.",
    items: [
      { name: "React Native", tier: "Core", note: "My primary mobile platform, from Grand Slams to farm fields.", cases: ["ao", "agco"] },
      { name: "Expo", tier: "Shipped", note: "Managed and bare workflows.", cases: [] },
      { name: "Realm", tier: "Shipped", note: "Local-first persistence for offline apps.", cases: ["agco"] },
      { name: "Mapbox", tier: "Shipped", note: "Field-level maps and geo context.", cases: ["agco"] },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Fast, accessible interfaces, from government portals to this site.",
    items: [
      { name: "React", tier: "Core", note: "Enterprise web apps across three continents.", cases: ["commerce", "utility"], alsoIn: "This portfolio" },
      { name: "TypeScript", tier: "Core", note: "Default for anything that has to last.", cases: ["agco"], alsoIn: "This portfolio" },
      { name: "JavaScript", tier: "Core", note: "Where it all started.", cases: ["ao", "gst", "commerce", "utility"] },
      { name: "AngularJS", tier: "Shipped", note: "National-scale portal front end.", cases: ["gst"] },
      { name: "Sass", tier: "Shipped", note: "Design layers for large codebases.", cases: ["commerce", "utility"] },
      { name: "Tailwind CSS", tier: "Shipped", note: "Utility-first styling.", cases: [], alsoIn: "This portfolio" },
      { name: "Framer Motion", tier: "Shipped", note: "Every animation you've seen here.", cases: [], alsoIn: "This portfolio" },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    blurb: "Systems that stay understandable as teams and features grow.",
    items: [
      { name: "Offline-first", tier: "Core", note: "Local database first, sync second.", cases: ["agco"] },
      { name: "Micro frontends", tier: "Shipped", note: "Independent teams, one product.", cases: [] },
      { name: "Super apps", tier: "Shipped", note: "Many mini-apps in one shell.", cases: [] },
      { name: "Real-time data", tier: "Shipped", note: "Live channels feeding a normalised store.", cases: ["ao"] },
      { name: "Desktop apps", tier: "Shipped", note: "Taking web skills to the desktop.", cases: [] },
      { name: "UI pattern analysis", tier: "Core", note: "Design patterns tuned for conversion.", cases: ["commerce"] },
    ],
  },
  {
    id: "state",
    label: "State",
    blurb: "Predictable data flow, even when the network isn't.",
    items: [
      { name: "Redux", tier: "Core", note: "Normalised stores at scale.", cases: ["ao", "agco", "commerce", "utility"] },
      { name: "Redux-Saga", tier: "Core", note: "Long-running async flows, made testable.", cases: ["ao", "agco", "commerce", "utility"] },
      { name: "Redux Toolkit", tier: "Shipped", note: "Modern Redux with less boilerplate.", cases: ["agco"] },
      { name: "Zustand", tier: "Shipped", note: "Lightweight stores; powers the explorer log here.", cases: [], alsoIn: "This portfolio" },
    ],
  },
  {
    id: "backend",
    label: "Backend & API",
    blurb: "Enough of the server to design great contracts with it.",
    items: [
      { name: "REST APIs", tier: "Core", note: "Contract design and integration.", cases: ["ao", "agco", "gst", "commerce", "utility"] },
      { name: "Python", tier: "Shipped", note: "Embedded servers and data work.", cases: ["iot"] },
      { name: "Embedded web servers", tier: "Shipped", note: "Serving UIs straight from hardware.", cases: ["iot"] },
      { name: "Node.js", tier: "Exploring", note: "APIs and AI services.", cases: [] },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & CI/CD",
    blurb: "From commit to production without drama.",
    items: [
      { name: "GitHub", tier: "Core", note: "Reviews, workflows, collaboration.", cases: [] },
      { name: "Azure DevOps · VSTS", tier: "Shipped", note: "Enterprise pipelines and boards.", cases: ["agco"] },
      { name: "Vercel", tier: "Shipped", note: "Edge-deployed front ends.", cases: [], alsoIn: "This portfolio" },
      { name: "Render", tier: "Shipped", note: "Hosting the AI twin's backend.", cases: [], alsoIn: "This portfolio" },
    ],
  },
  {
    id: "ai",
    label: "AI & Data",
    blurb: "Where I'm spending my curiosity right now.",
    items: [
      { name: "LLM assistants", tier: "Exploring", note: "The AI twin you can talk to on this site.", cases: [], alsoIn: "This portfolio" },
      { name: "Data analysis", tier: "Exploring", note: "Python analysis and visualisation (Microsoft certified).", cases: [] },
      { name: "Neural networks", tier: "Exploring", note: "Enthusiastic neophyte.", cases: [] },
      { name: "IoT", tier: "Shipped", note: "Sensors, Raspberry Pi and published research.", cases: ["iot"] },
    ],
  },
  {
    id: "design",
    label: "Design & Tools",
    blurb: "An engineer who speaks fluent designer.",
    items: [
      { name: "Figma", tier: "Shipped", note: "High-fidelity design and prototyping (Google certified).", cases: [] },
      { name: "UX research", tier: "Shipped", note: "Testing early concepts with real users.", cases: [] },
      { name: "VS Code", tier: "Core", note: "Home.", cases: [] },
    ],
  },
];

export const TECH_COUNT = STACK.reduce((n, g) => n + g.items.length, 0);

export const PRINCIPLES = [
  {
    title: "Offline is a feature.",
    body: "Great apps assume the network will fail, and make that invisible to the person using them.",
  },
  {
    title: "Performance is UX.",
    body: "Every dropped frame is a small broken promise. Measure first, then optimise what matters.",
  },
  {
    title: "Architecture you can draw.",
    body: "If the team can't sketch it on a whiteboard, it's too clever. Clear boundaries beat clever abstractions.",
  },
  {
    title: "Design-literate engineering.",
    body: "Google-certified in UX. I speak research, prototypes and Figma, not just props and state.",
  },
];

export const MILESTONES: { mark: string; title: string; body: string; caseId: CaseId }[] = [
  {
    mark: "AO",
    title: "Official app of a Grand Slam",
    body: "Built the official Australian Open 2020 mobile app.",
    caseId: "ao",
  },
  {
    mark: "₹",
    title: "A nation's tax portal",
    body: "Helped build India's indirect-tax implementation portal.",
    caseId: "gst",
  },
  {
    mark: "IEEE",
    title: "Published research",
    body: "Embedded web server architecture for IoT kitchen monitoring, in IEEE Xplore.",
    caseId: "iot",
  },
];

export const CERTIFICATIONS = [
  { title: "Data Analysis and Visualization with Python", issuer: "Microsoft", year: "2026", id: "2PHTDCPV95A2" },
  { title: "Python Programming Fundamentals", issuer: "Microsoft", year: "2026", id: "2HIBXN9C04AZ" },
  { title: "Create High-Fidelity Designs and Prototypes in Figma", issuer: "Google", year: "2023", id: "5EJDYXK3EUT4" },
  { title: "Conduct UX Research and Test Early Concepts", issuer: "Google", year: "2023", id: "QT4YNEVAFK38" },
  { title: "Build Wireframes and Low-Fidelity Prototypes", issuer: "Google", year: "2023", id: "323WD8FKDKE4" },
  { title: "UX Design Process: Empathize, Define, and Ideate", issuer: "Google", year: "2023", id: "PR6KH6BA993X" },
  { title: "Foundations of User Experience Design", issuer: "Google", year: "2023", id: "JKTXXUF3VCNP" },
  { title: "Infosys Global Agile Developer", issuer: "Infosys", year: "2019", id: null },
  { title: "React Native", issuer: "Infosys", year: "2019", id: null },
  { title: "ReactJS", issuer: "Infosys", year: "2018", id: null },
];

export type AchievementId =
  | "signal"
  | "case"
  | "detective"
  | "globe"
  | "stack"
  | "blueprint"
  | "contact"
  | "complete";

export const ACHIEVEMENTS: { id: AchievementId; title: string; hint: string }[] = [
  { id: "signal", title: "Found the signal", hint: "Something drifts through the first screen. Catch it." },
  { id: "case", title: "Case file opened", hint: "Open any project case study." },
  { id: "detective", title: "Detective", hint: "Open three different case files." },
  { id: "globe", title: "Globetrotter", hint: "Travel the whole journey, end to end." },
  { id: "stack", title: "Stack diver", hint: "Inspect five technologies in the toolbox." },
  { id: "blueprint", title: "Architect's eye", hint: "Old-school cheat codes still work here." },
  { id: "contact", title: "Connection made", hint: "Grab my email." },
  { id: "complete", title: "Completionist", hint: "Unlock everything else." },
];

export const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "journey", label: "Journey" },
  { id: "stack", label: "Stack" },
  { id: "proof", label: "Proof" },
  { id: "contact", label: "Contact" },
];
