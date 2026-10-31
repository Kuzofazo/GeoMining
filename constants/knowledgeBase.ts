export interface KnowledgeItem {
  keywords: string[];
  response: string;
  topic?: string;
  shouldEndSession?: boolean;
}

export const KNOWLEDGE_BASE: KnowledgeItem[] = [
  // --- LIMEC 2026 & EVENTS ---
  {
    topic: 'LIMEC 2026',
    keywords: [
      'limec',
      'limec 2026',
      'conference',
      'expo',
      'farmington',
      'energy conference',
      'mining conference',
      'boakai',
      'event',
      'latest news',
    ],
    response:
      'GeoMining & Environmental Consultancy Inc. proudly participated in the Liberia International Mining & Energy Conference & Expo (LIMEC 2026) held at The Farmington Hotel in Margibi County from October 28–29, 2026. The prestigious summit was attended by His Excellency President Joseph Nyuma Boakai, Sr., Minister of Mines & Energy Hon. R. Matenokay Tingban, and international delegates. Executive Director Carlos E. Tingban and the GeoMining delegation engaged industry leaders to advance sustainable mining, petroleum potential, and energy investment across Liberia.',
  },

  // --- COMPANY OVERVIEW ---
  {
    topic: 'Mission',
    keywords: ['mission', 'goal', 'purpose', 'objective', 'aim'],
    response:
      'Our mission is to deliver technically excellent, socially responsible, and environmentally sound consulting services. We de-risk projects, ensure regulatory compliance, and create sustainable value for our clients. It’s about engineering a sustainable future through technical precision and environmental care.',
  },
  {
    topic: 'Vision',
    keywords: ['vision', 'future', 'aspirations', 'dream'],
    response:
      'To pioneer a new global standard for responsible resource development, where cutting-edge geological insight, innovative technology, and unwavering stewardship converge to unlock the sustainable potential of mineral resources for enduring prosperity.',
  },
  {
    topic: 'Motto',
    keywords: ['motto', 'slogan', 'tagline', 'guiding principle'],
    response:
      "Our motto is 'Engineering a Sustainable future.' This principle directs every project we undertake, ensuring we balance technical precision with environmental integrity.",
  },
  {
    topic: 'About',
    keywords: [
      'who are you',
      'company description',
      'what is geomining',
      'overview',
      'introduction',
      'about',
    ],
    response:
      'GEOMINING & ENVIRONMENTAL CONSULTANCY INC is a registered and recognized Liberian firm founded in 2025. We provide geological, mineral exploration, mining, and environmental consulting services to mining companies, investors, and stakeholders. We guide exploration, compliance, and project support in the extractive and environmental sectors.',
  },
  {
    topic: 'Differentiators',
    keywords: [
      'why choose you',
      'different',
      'advantage',
      'unique',
      'benefit',
      'differentiator',
    ],
    response:
      'We stand out because of our Integrated Approach—geologists and environmentalists work together from day one. We combine global standards with deep local Liberian insight, focusing on early risk identification and sustainable-by-design project planning.',
  },
  {
    topic: 'Clients',
    keywords: [
      'clients',
      'who do you serve',
      'customers',
      'sectors',
      'industries',
    ],
    response:
      'We serve a diverse range of sectors: Mining & Exploration Companies, Energy Developers (Oil, Gas, Renewables), Engineering Firms, Financial Institutions, and Government Agencies. Whoever needs resource or environmental expertise in West Africa, we are here to help.',
  },
  {
    topic: 'History',
    keywords: [
      'history',
      'founding',
      'founded',
      'origin',
      'background',
      'start',
    ],
    response:
      'GEOMINING & ENVIRONMENTAL CONSULTANCY INC was founded in 2025 by Carlos E. Tingban, Sr., a former Assistant Minister for Mines, Mineral Resource Development and Conservation of Liberia. We were established to bridge the gap between geological discovery and environmental responsibility.',
  },
  {
    topic: 'Carlos Tingban',
    keywords: [
      'carlos',
      'tingban',
      'founder',
      'director',
      'ceo',
      'manager',
      'leader',
      'md',
    ],
    response:
      'Our Founder & Managing Director is Carlos E. Tingban, Sr. He is a former Assistant Minister for Mines, Mineral Resource Development and Conservation of Liberia. He leads our strategic vision with decades of top-tier industry and regulatory experience.',
  },
  {
    topic: 'Team',
    keywords: ['team', 'staff', 'experts', 'people', 'consultants'],
    response:
      'Our team is led by Carlos E. Tingban, Sr. and consists of seasoned professionals including Senior Geologists, Environmental Consultants specializing in EIA/ESHIA, and Mining Engineers. We leverage deep knowledge of the Liberian and West African mining sectors.',
  },
  {
    topic: 'Partnership',
    keywords: [
      'partner',
      'partnership',
      'collaborate',
      'work with you',
      'invest',
      'join us',
    ],
    response:
      'We collaborate with organizations and investors through technical consultancy, project development, and strategic investment. You can submit a partnership inquiry via the "Partner With Us" button on our homepage or contact us directly.',
  },
  {
    topic: 'Promise',
    keywords: ['promise', 'commitment', 'integrity', 'future'],
    response:
      'Our promise: We are partners in building a future where resource development and environmental integrity go hand in hand. We turn complex geological challenges into opportunities for sustainable growth.',
  },

  // --- SERVICES ---

  {
    topic: 'EIA Services',
    keywords: [
      'eia',
      'environmental impact assessment',
      'baseline studies',
      'mitigation',
      'ems',
      'monitoring',
    ],
    response:
      'Our Environmental Impact Assessment (EIA) services include environmental baseline studies, impact analysis, mitigation planning, Environmental Management Systems (EMS), and compliance monitoring. We ensure projects meet both EPA Liberia regulations and international standards.',
  },
  {
    topic: 'Geological Services',
    keywords: [
      'geology',
      'geological',
      'surveys',
      'mapping',
      'exploration',
      'drilling',
      'vlf',
      'ip',
    ],
    response:
      'Our geological services cover comprehensive field mapping, structural analysis, VLF/IP surveys, drilling management, and NI 43-101/JORC compliant reporting. We use modern geospatial technologies like GIS and Remote Sensing to optimize exploration.',
  },
  {
    topic: 'Geotechnical Services',
    keywords: [
      'geotechnical',
      'soil testing',
      'ground investigation',
      'engineering geology',
      'foundation',
      'stability',
    ],
    response:
      'We provide specialized geotechnical engineering, including soil testing, ground investigations, engineering geology analysis, and structural earth assessments. These services ensure safe load-bearing capacities and long-term stability for infrastructure.',
  },
  {
    topic: 'Advisory & Strategy',
    keywords: [
      'advisory',
      'strategy',
      'feasibility',
      'due diligence',
      'technical studies',
      'review',
    ],
    response:
      'Our Advisory services include Technical Studies (Scoping, PFS, FS), Independent Reviews, Due Diligence for investors, and Digital Services like 3D modeling and digital twins to guide high-stakes decision-making.',
  },
  {
    topic: 'Services Overview',
    keywords: [
      'service',
      'expertise',
      'offer',
      'do',
      'consulting',
      'capabilities',
      'what do you do',
    ],
    response:
      'We offer four core pillars: 1) Discovery & Definition (Geology & Exploration), 2) Engineering & Design (Mine & Geotechnical), 3) ESG (Environmental, Social & Compliance), and 4) Advisory & Strategic Support. We support the entire project lifecycle.',
  },

  // --- SUBSIDIARIES ---
  {
    topic: 'Subsidiaries',
    keywords: [
      'subsidiary',
      'companies',
      'group',
      'stonecrest',
      'resource',
      'mining corporation',
    ],
    response:
      'The group operates two specialized subsidiaries: StoneCrest Resource Limited (exploration arm focusing on mapping and resource estimation) and StoneCrest Mining Corporation (production arm managing mine operations and HSE).',
  },

  // --- SUSTAINABILITY & GOVERNANCE ---
  {
    topic: 'Sustainability Pillars',
    keywords: [
      'sustainability',
      'pillars',
      'commitment',
      'community',
      'safety',
      'rehabilitation',
    ],
    response:
      'Our sustainability framework includes six pillars: 1) Environmental Protection, 2) Community Development (CDAs), 3) Occupational Safety, 4) Regulatory Compliance, 5) Local Employment/Capacity Building, and 6) Rehabilitation & Closure planning.',
  },
  {
    topic: 'Governance & Compliance',
    keywords: [
      'governance',
      'compliance',
      'legal',
      'law',
      'epa',
      'regulation',
      'ethics',
    ],
    response:
      'We operate with strict adherence to the Liberia Mining and Minerals Law and the Environmental Protection and Management Law. We are fully compliant with the Liberia EPA and Ministry of Land, Mines & Energy standards, maintaining a zero-tolerance policy for corruption.',
  },

  // --- PROJECTS ---
  {
    topic: 'Project Locations',
    keywords: [
      'projects',
      'sites',
      'where',
      'location',
      'nimba',
      'bong',
      'bassa',
      'cluster',
      'sinoe',
    ],
    response:
      'Our active projects include the Nimba Project, Bong Mines Operations, Grand Bassa Setup, Western Cluster, and Sinoe Exploration. We also have field teams in Buchanan and ongoing assessments in Gbarnga, Harper, and Voinjama.',
  },

  // --- CONTACT ---
  {
    topic: 'Contact & HQ',
    keywords: [
      'contact',
      'address',
      'location',
      'office',
      'headquarters',
      'sinkor',
      'monrovia',
      'phone',
      'email',
    ],
    response:
      'Our headquarters are located on Cheeseman Avenue, Airfield New Road, Sinkor, Monrovia, Liberia. You can reach us via email at info@geominingec.com or geomininge@gmail.com, and by phone/WhatsApp at +231 77 777 2778.',
  },

  // --- CHAT CONTROL ---
  {
    topic: 'Greetings',
    keywords: [
      'hello',
      'hi',
      'hey',
      'greeting',
      'good morning',
      'good afternoon',
    ],
    response:
      'Hello! I’m knowledgeable about all our services, projects, and subsidiaries. How can I help you today?',
  },
  {
    topic: 'Check In',
    keywords: ['are you there', 'listening', 'hello?'],
    response: 'I’m listening… take your time.',
  },
  {
    topic: 'Appreciation',
    keywords: ['thanks', 'thank you', 'appreciate', 'helpful'],
    response:
      'You are welcome! If you need details on specific services or our projects, just ask.',
  },
  {
    topic: 'Clarification',
    keywords: ['confused', 'understand', 'what?', 'explain'],
    response:
      'If something isn’t clear, just let me know I’m happy to explain it another way.',
  },
  {
    topic: 'Save Conversation',
    keywords: ['save', 'download', 'keep', 'record', 'transcript'],
    response:
      'I’ll save this conversation, so you can read it again later if you need to.',
    shouldEndSession: false,
  },
  {
    topic: 'Closing',
    keywords: ['end', 'done', 'bye', 'goodbye', 'nothing else', 'no'],
    response: 'Before you go, is there anything else you’d like help with?',
    shouldEndSession: true,
  },
];

interface ResearchResult {
  response: string;
  wasSearch: boolean;
  topic?: string;
  shouldEndSession?: boolean;
}

export const findResponse = (input: string): ResearchResult => {
  const lowerInput = input.toLowerCase();
  const searchTriggers = [
    'search',
    'find',
    'tell me about',
    'tell me more',
    'what is',
    'what are',
    'info on',
    'information about',
  ];

  const wasSearch = searchTriggers.some((trigger) =>
    lowerInput.includes(trigger)
  );

  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some((keyword) => lowerInput.includes(keyword))) {
      return {
        response: item.response,
        wasSearch,
        topic: item.topic,
        shouldEndSession: item.shouldEndSession,
      };
    }
  }

  return {
    response:
      "That's an interesting point. If something isn’t clear, just let me know I’m happy to explain it another way. Or you can check our 'Services' page for more details.",
    wasSearch: false,
  };
};
