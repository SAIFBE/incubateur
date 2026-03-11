export const SUBMISSIONS = [
  {
    id: 's1',
    userId: 'u1', // Ahmed
    title: 'Smart AgroTech Platform',
    category: 'c5', // Agritech
    sector: 'Agriculture',
    program: 'p1', // Développement Digital
    projectType: 'team',
    summary: 'A platform to help farmers monitor crop health using IoT and drone imagery.',
    problem: 'Farmers lose up to 30% of their yields due to late detection of crop diseases.',
    solution: 'Deploy cost-effective sensors and drones attached to an AI-powered analytics dashboard.',
    objectives: 'Increase crop yield by 15% and reduce water usage by 20%.',
    innovation: 'Uses proprietary lightweight computer vision models running on edge devices.',
    targetAudience: 'Medium to large scale farmers in Morocco.',
    marketNeed: 'Growing water scarcity and need for maximizing agricultural output.',
    existingAlternatives: 'Expensive imported solutions with no local support.',
    differentiation: 'Locally developed, affordable, and tailored for Moroccan climate and crops.',
    teamMembers: 'Ahmed (Backend), Youssef (Hardware), Leila (Agronomist)',
    skills: 'React, Node.js, Python, IoT, Agronomy',
    supportNeeds: ['mentoring', 'funding guidance', 'networking'],
    attachments: [
      { name: 'pitch_deck_v1.pdf', size: 2450000, type: 'application/pdf' }
    ],
    status: 'under_review',
    createdAt: '2026-02-15T10:30:00Z',
    updatedAt: '2026-03-01T14:20:00Z'
  },
  {
    id: 's2',
    userId: 'u1',
    title: 'Eco-Friendly Delivery Network',
    category: 'c2', // Green Tech
    sector: 'Logistics',
    program: 'p1',
    projectType: 'individual',
    summary: 'Last-mile delivery service using electric bicycles in crowded city centers.',
    problem: 'High carbon footprint and slow delivery times in congested urban areas.',
    solution: 'A fleet of e-bikes connected via a smart routing Mobile App.',
    objectives: 'Achieve zero-emission deliveries in Casablanca center.',
    innovation: 'Dynamic routing algorithm optimized for bike lanes and traffic patterns.',
    targetAudience: 'E-commerce businesses and local restaurants.',
    marketNeed: 'Fast and sustainable delivery options.',
    existingAlternatives: 'Traditional motorcycle couriers (polluting and noisy).',
    differentiation: 'Focus entirely on green delivery and brand image.',
    teamMembers: 'Ahmed (Founder)',
    skills: 'Operations, Mobile Dev',
    supportNeeds: ['funding guidance'],
    attachments: [],
    status: 'draft',
    createdAt: '2026-03-05T09:15:00Z',
    updatedAt: '2026-03-05T09:15:00Z'
  },
  {
    id: 's3',
    userId: 'u2', // Fatima Zahra
    title: 'Health Track Pro',
    category: 'c4', // Health Tech
    sector: 'Healthcare',
    program: 'p2', // IA
    projectType: 'team',
    summary: 'An AI-powered app that helps patients with chronic illnesses track their symptoms and medication.',
    problem: 'Patients often forget to take medication and fail to accurately report symptoms to their doctors.',
    solution: 'A gamified mobile application with smart reminders and visual symptom logging.',
    objectives: 'Improve medical adherence by 40% among early users.',
    innovation: 'Uses LLMs to extract insights from voice-based symptom reports.',
    targetAudience: 'Elderly patients and individuals with chronic diseases.',
    marketNeed: 'Better patient-doctor communication tools.',
    existingAlternatives: 'Paper logs, generic reminder apps.',
    differentiation: 'Voice-to-text integration specifically for Moroccan dialects.',
    teamMembers: 'Fatima Zahra (AI Lead), Omar (Medical Student)',
    skills: 'Machine Learning, NLP, UI/UX',
    supportNeeds: ['mentoring', 'technical support'],
    attachments: [],
    status: 'requires_changes',
    createdAt: '2026-01-20T11:00:00Z',
    updatedAt: '2026-02-28T16:45:00Z'
  },
  {
    id: 's4',
    userId: 'u2',
    title: 'Artisan Connect',
    category: 'c6', // E-commerce
    sector: 'Handicraft',
    program: 'p4', // Gestion
    projectType: 'team',
    summary: 'A marketplace connecting local artisans directly with global buyers.',
    problem: 'Artisans rely on middlemen who take huge margins.',
    solution: 'A B2C platform where artisans can set up storefronts easily.',
    objectives: 'Onboard 500 artisans in the first year.',
    innovation: 'Integrated AR try-on for rugs and home decor.',
    targetAudience: 'Global consumers looking for authentic handmade products.',
    marketNeed: 'Fair trade and direct-to-consumer models for traditional crafts.',
    existingAlternatives: 'Etsy, Local bazaars.',
    differentiation: 'Focus entirely on Moroccan craftsmanship with verified authenticity.',
    teamMembers: 'Fatima Zahra, Amina, Karim',
    skills: 'Marketing, E-commerce, Photography',
    supportNeeds: ['mentoring', 'networking'],
    attachments: [
      { name: 'business_plan.pdf', size: 5200000, type: 'application/pdf' },
      { name: 'ui_mockups.png', size: 1200000, type: 'image/png' }
    ],
    status: 'accepted',
    createdAt: '2025-11-10T10:00:00Z',
    updatedAt: '2025-12-15T09:30:00Z'
  },
  {
    id: 's5',
    userId: 'u1',
    title: 'VR History Explorer',
    category: 'c3', // Creative
    sector: 'Education',
    program: 'p5', // Arts Graphiques
    projectType: 'team',
    summary: 'Virtual reality experiences of historical Moroccan landmarks.',
    problem: 'Students find history boring; limited tourism access to certain sites.',
    solution: 'High-fidelity VR reconstructions of ancient cities and monuments.',
    objectives: 'Implement in 50 schools pilot program.',
    innovation: 'Historically accurate reconstructions guided by academic research.',
    targetAudience: 'Schools, Museums, Tour operators.',
    marketNeed: 'Immersive educational content.',
    existingAlternatives: 'Textbooks, documentaries.',
    differentiation: 'Interactive narratives within the VR environment.',
    teamMembers: 'Ahmed, Sara (3D Artist)',
    skills: 'Unity, 3D Modeling, History',
    supportNeeds: ['funding guidance', 'technical support'],
    attachments: [],
    status: 'submitted',
    createdAt: '2026-03-08T14:20:00Z',
    updatedAt: '2026-03-08T14:20:00Z'
  },
  {
    id: 's6',
    userId: 'u2',
    title: 'Smart Waste Bin',
    category: 'c2', // Green Tech
    sector: 'Smart City',
    program: 'p6', // Electromécanique
    projectType: 'team',
    summary: 'Solar-powered waste bins that compact trash and alert collection services when full.',
    problem: 'Inefficient waste collection routes leading to overflowing bins and high fuel costs.',
    solution: 'IoT-enabled bins that communicate their fill level.',
    objectives: 'Reduce collection logistics costs by 30%.',
    innovation: 'Built-in solar compactor increases capacity by 5x.',
    targetAudience: 'Municipalities, large campuses.',
    marketNeed: 'Cleaner streets and optimized public services.',
    existingAlternatives: 'BigBelly (import only).',
    differentiation: 'Designed for local manufacturing, much lower unit cost.',
    teamMembers: 'Fatima Zahra, Rachid (Mech. Engineer)',
    skills: 'Hardware design, C++, Embedded Systems',
    supportNeeds: ['mentoring', 'funding guidance', 'training'],
    attachments: [],
    status: 'rejected',
    createdAt: '2025-09-05T08:00:00Z',
    updatedAt: '2025-10-12T11:20:00Z'
  },
  {
    id: 's7',
    userId: 'u1',
    title: 'AutoMech Diagnostic Tool',
    category: 'c1', // IT
    sector: 'Automotive',
    program: 'p7', // Fabrication Mecanique
    projectType: 'individual',
    summary: 'A low-cost universal OBD2 scanner with a mobile app for independent mechanics.',
    problem: 'Professional diagnostic tools are too expensive for small garages.',
    solution: 'A simple Bluetooth dongle paired with a subscription-based diagnostic app.',
    objectives: 'Reach 1,000 independent mechanics in year 1.',
    innovation: 'Community-driven database of fixes and workarounds.',
    targetAudience: 'Independent mechanics and auto enthusiasts.',
    marketNeed: 'Affordable vehicle diagnostics.',
    existingAlternatives: 'Expensive OEM scanners, generic cheap scanners with poor software.',
    differentiation: 'Focus on French/Arabic localization and local car parc models.',
    teamMembers: 'Ahmed',
    skills: 'Mobile Dev, Electronics',
    supportNeeds: ['mentoring'],
    attachments: [],
    status: 'archived',
    createdAt: '2025-06-15T10:00:00Z',
    updatedAt: '2025-11-20T10:00:00Z'
  },
  {
    id: 's8',
    userId: 'u2',
    title: 'Virtual Fitting Room',
    category: 'c6', // E-commerce
    sector: 'Fashion Tech',
    program: 'p2', // IA
    projectType: 'team',
    summary: 'AI plugin for e-commerce sites to allow virtual clothes fitting using a single photo.',
    problem: 'High return rates in online fashion retail due to sizing issues (up to 30%).',
    solution: 'Generative AI model that drapes clothing realistically onto a user picture.',
    objectives: 'Reduce return rates by 15% for partnered brands.',
    innovation: 'Real-time fabric physics simulation on mobile browsers.',
    targetAudience: 'Online fashion retailers.',
    marketNeed: 'Improving online shopping conversion and reducing reverse logistics costs.',
    existingAlternatives: 'Basic size calculators, static overlay tools.',
    differentiation: 'High visual fidelity and simple integration via API.',
    teamMembers: 'Fatima Zahra, Meryem',
    skills: 'Computer Vision, WebGL, Node.js',
    supportNeeds: ['networking', 'funding guidance'],
    attachments: [],
    status: 'revised',
    createdAt: '2026-02-28T09:00:00Z',
    updatedAt: '2026-03-07T15:30:00Z'
  }
];

export const COMMENTS = [
  {
    id: 'msg1',
    submissionId: 's1',
    authorRole: 'admin',
    authorName: 'Admin CMC BMK',
    content: 'Very promising idea. Can you provide more details on the sensors you plan to use? Are they off-the-shelf or custom built?',
    createdAt: '2026-02-25T14:00:00Z'
  },
  {
    id: 'msg2',
    submissionId: 's1',
    authorRole: 'trainee',
    authorName: 'Ahmed Stagiaire',
    content: 'Thank you! We plan to use off-the-shelf ESP32 microcontrollers combined with generic soil moisture sensors to keep costs down initially.',
    createdAt: '2026-02-26T10:15:00Z'
  },
  {
    id: 'msg3',
    submissionId: 's3',
    authorRole: 'admin',
    authorName: 'Admin CMC BMK',
    content: 'The concept is good, but the business model is missing. How do you plan to monetize? Please revise and add a clear revenue strategy.',
    createdAt: '2026-02-10T16:30:00Z'
  },
  {
    id: 'msg4',
    submissionId: 's4',
    authorRole: 'admin',
    authorName: 'Admin CMC BMK',
    content: 'Excellent project and solid team. We are happy to accept this into the incubator program! Next step: scheduling your first mentoring session.',
    createdAt: '2025-12-15T09:30:00Z'
  },
  {
    id: 'msg5',
    submissionId: 's6',
    authorRole: 'admin',
    authorName: 'Admin CMC BMK',
    content: 'Unfortunately, this space is highly saturated and heavily dependent on government contracts which are difficult for early-stage startups to secure without massive backing. We recommend pivoting.',
    createdAt: '2025-10-12T11:20:00Z'
  },
  {
    id: 'msg6',
    submissionId: 's8',
    authorRole: 'admin',
    authorName: 'Admin CMC BMK',
    content: 'Could you please elaborate on the specific AI models being used? The current description is too vague. Also update your attachments with a proper pitch deck.',
    createdAt: '2026-03-05T09:00:00Z'
  },
  {
    id: 'msg7',
    submissionId: 's8',
    authorRole: 'trainee',
    authorName: 'Fatima Zahra Trainee',
    content: 'I have updated the submission with more details on our diffusion models and added the requested attachment data.',
    createdAt: '2026-03-07T15:30:00Z'
  }
];

export const STATUS_HISTORY = [
  { id: 'h1', submissionId: 's1', fromStatus: 'draft', toStatus: 'submitted', changedBy: 'Ahmed Stagiaire', changedAt: '2026-02-20T10:00:00Z' },
  { id: 'h2', submissionId: 's1', fromStatus: 'submitted', toStatus: 'received', changedBy: 'Admin CMC BMK', changedAt: '2026-02-21T09:00:00Z' },
  { id: 'h3', submissionId: 's1', fromStatus: 'received', toStatus: 'under_review', changedBy: 'Admin CMC BMK', changedAt: '2026-02-25T14:00:00Z' },
  
  { id: 'h4', submissionId: 's3', fromStatus: 'draft', toStatus: 'submitted', changedBy: 'Fatima Zahra Trainee', changedAt: '2026-01-25T11:00:00Z' },
  { id: 'h5', submissionId: 's3', fromStatus: 'submitted', toStatus: 'under_review', changedBy: 'Admin CMC BMK', changedAt: '2026-01-28T10:00:00Z' },
  { id: 'h6', submissionId: 's3', fromStatus: 'under_review', toStatus: 'requires_changes', changedBy: 'Admin CMC BMK', changedAt: '2026-02-10T16:30:00Z' },

  { id: 'h7', submissionId: 's4', fromStatus: 'under_review', toStatus: 'accepted', changedBy: 'Admin CMC BMK', changedAt: '2025-12-15T09:30:00Z' },
  
  { id: 'h8', submissionId: 's6', fromStatus: 'under_review', toStatus: 'rejected', changedBy: 'Admin CMC BMK', changedAt: '2025-10-12T11:20:00Z' },
  
  { id: 'h9', submissionId: 's8', fromStatus: 'submitted', toStatus: 'under_review', changedBy: 'Admin CMC BMK', changedAt: '2026-03-02T10:00:00Z' },
  { id: 'h10', submissionId: 's8', fromStatus: 'under_review', toStatus: 'requires_changes', changedBy: 'Admin CMC BMK', changedAt: '2026-03-05T09:00:00Z' },
  { id: 'h11', submissionId: 's8', fromStatus: 'requires_changes', toStatus: 'revised', changedBy: 'Fatima Zahra Trainee', changedAt: '2026-03-07T15:30:00Z' }
];
