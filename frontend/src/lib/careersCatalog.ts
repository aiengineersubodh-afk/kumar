export interface TrackItem {
  id: string;
  title: string;
  category: 'INTERNSHIP' | 'RESEARCH';
  shortDescription: string;
  fullDescription: string;
  skills: string[];
  icon: string;
}

export const INTERNSHIP_TRACKS: TrackItem[] = [
  {
    id: 'software-web-dev',
    title: 'Software & Web Development',
    category: 'INTERNSHIP',
    shortDescription:
      'Build robust modern web applications, scalable backends, responsive interfaces, and production-ready APIs.',
    fullDescription:
      'Gain hands-on engineering experience designing and maintaining component-based architectures, microservices, and modern database layers utilizing enterprise frameworks.',
    skills: [
      'Frontend development',
      'Backend development',
      'Full-stack engineering',
      'React and Next.js',
      'Node.js and API development',
      'Database integration',
    ],
    icon: 'Code2',
  },
  {
    id: 'ai-machine-learning',
    title: 'Artificial Intelligence & Machine Learning',
    category: 'INTERNSHIP',
    shortDescription:
      'Develop intelligent systems, generative AI integrations, neural workflows, and predictive analytics models.',
    fullDescription:
      'Explore real-world applications of foundation models, deterministic prompt pipelines, multi-agent frameworks, and data-driven intelligence.',
    skills: [
      'Generative AI',
      'Large language model applications',
      'AI agents',
      'Prompt engineering',
      'Predictive analytics',
      'Intelligent automation',
    ],
    icon: 'Sparkles',
  },
  {
    id: 'data-engineering-analytics',
    title: 'Data Engineering & Analytics',
    category: 'INTERNSHIP',
    shortDescription:
      'Design reliable data processing pipelines, ETL workflows, business intelligence dashboards, and structured analytics.',
    fullDescription:
      'Work with high-throughput streaming systems, relational and columnar warehouses, pipeline transformation tools, and visual storytelling.',
    skills: [
      'Python and SQL',
      'ETL and data pipelines',
      'Data processing',
      'Business intelligence',
      'Data visualization',
      'Analytics solutions',
    ],
    icon: 'Database',
  },
  {
    id: 'cloud-devops',
    title: 'Cloud Computing & DevOps',
    category: 'INTERNSHIP',
    shortDescription:
      'Architect resilient cloud infrastructures, continuous integration pipelines, container fleets, and deployment automation.',
    fullDescription:
      'Learn cloud governance, infrastructure as code, automated rollouts, Kubernetes container orchestration, and serverless architectures.',
    skills: [
      'AWS, Azure, and Google Cloud',
      'Cloud architecture',
      'Docker and containerization',
      'CI/CD pipelines',
      'Deployment automation',
      'Cloud infrastructure',
    ],
    icon: 'Cloud',
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    category: 'INTERNSHIP',
    shortDescription:
      'Practice defensive security principles, application vulnerability auditing, secure coding standards, and threat monitoring.',
    fullDescription:
      'Learn how enterprise software is hardened against unauthorized access, injection vectors, data exfiltration, and supply-chain vulnerabilities.',
    skills: [
      'Application security',
      'Secure coding',
      'Security testing',
      'Defensive security',
      'Vulnerability assessment in authorized environments',
      'Security monitoring',
    ],
    icon: 'ShieldCheck',
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX & Digital Product Design',
    category: 'INTERNSHIP',
    shortDescription:
      'Craft intuitive product experiences, high-fidelity prototypes, accessible component systems, and user journeys.',
    fullDescription:
      'Translate complex enterprise workflows into elegant, human-centric software interfaces adhering to rigorous design systems and WCAG accessibility standards.',
    skills: [
      'UI/UX design',
      'Figma and prototyping',
      'Wireframing',
      'User research',
      'Responsive design',
      'Accessibility',
    ],
    icon: 'Palette',
  },
  {
    id: 'quality-engineering',
    title: 'Quality Engineering & Testing',
    category: 'INTERNSHIP',
    shortDescription:
      'Ensure software reliability through comprehensive manual testing, automated test suites, performance benchmarks, and QA strategy.',
    fullDescription:
      'Build end-to-end regression suites, load testing frameworks, API verification scripts, and continuous quality checkpoints for production systems.',
    skills: [
      'Manual testing',
      'Automated testing',
      'API testing',
      'Test case development',
      'Performance testing',
      'Software quality assurance',
    ],
    icon: 'CheckCircle2',
  },
  {
    id: 'it-consulting-ba',
    title: 'IT Consulting & Business Analysis',
    category: 'INTERNSHIP',
    shortDescription:
      'Bridge the gap between enterprise business challenges and digital technology architectures with structured analysis.',
    fullDescription:
      'Analyze business process flows, gather technical functional requirements, create architectural documentation, and facilitate cross-functional delivery.',
    skills: [
      'Requirements analysis',
      'Business process analysis',
      'Technical documentation',
      'Digital transformation',
      'Workflow optimization',
      'Project coordination',
    ],
    icon: 'Briefcase',
  },
];

export const RESEARCH_AREAS: TrackItem[] = [
  {
    id: 'generative-ai-llm-research',
    title: 'Generative AI & LLM Research',
    category: 'RESEARCH',
    shortDescription:
      'Investigate retrieval mechanisms, citation verification, model evaluation benchmarks, and enterprise hallucination reduction.',
    fullDescription:
      'Conduct rigorous experiments on context window performance, semantic search embedding quality, parameter-efficient fine-tuning, and responsible AI safety boundaries.',
    skills: [
      'Retrieval-augmented generation (RAG)',
      'LLM evaluation',
      'Hallucination reduction',
      'Model comparison',
      'Enterprise AI applications',
      'Responsible AI evaluation',
    ],
    icon: 'Brain',
  },
  {
    id: 'ai-agents-autonomous-workflows',
    title: 'AI Agents & Autonomous Workflows',
    category: 'RESEARCH',
    shortDescription:
      'Research deterministic agent communication, memory hierarchies, multi-agent debate, and tool-augmented autonomous execution.',
    fullDescription:
      'Explore theoretical and empirical bounds of multi-step task execution, automated reasoning chains, rollback mechanisms, and resilient agent protocols.',
    skills: [
      'Multi-agent systems',
      'Tool-using AI',
      'Workflow orchestration',
      'Planning and reasoning experiments',
      'Reliable automation',
    ],
    icon: 'Bot',
  },
  {
    id: 'ml-predictive-analytics',
    title: 'Machine Learning & Predictive Analytics',
    category: 'RESEARCH',
    shortDescription:
      'Explore novel predictive mathematical models, feature synthesis techniques, explainable AI, and high-dimensional forecasting.',
    fullDescription:
      'Investigate statistical learning algorithms, interpretability in black-box models, time-series anomaly detection, and cross-domain generalization.',
    skills: [
      'Predictive modeling',
      'Model evaluation',
      'Forecasting',
      'Classification',
      'Explainable AI',
      'Experiment design',
    ],
    icon: 'TrendingUp',
  },
  {
    id: 'data-engineering-intelligent-analytics',
    title: 'Data Engineering & Intelligent Analytics',
    category: 'RESEARCH',
    shortDescription:
      'Investigate autonomous data quality validation, automated knowledge graph construction, and high-efficiency graph processing.',
    fullDescription:
      'Research scalable graph indexing, real-time distributed ingestion boundaries, ontology alignment, and resilient metadata management for modern AI systems.',
    skills: [
      'Data quality',
      'Data pipeline optimization',
      'Knowledge graphs',
      'Analytics architecture',
      'Efficient data processing',
    ],
    icon: 'Network',
  },
  {
    id: 'cloud-distributed-systems',
    title: 'Cloud, Distributed Systems & Optimization',
    category: 'RESEARCH',
    shortDescription:
      'Analyze distributed consensus protocols, high-concurrency node scheduling, resilience engineering, and cloud cost frontiers.',
    fullDescription:
      'Evaluate latency profiles across edge and multi-region clusters, failover convergence times, cold-start latency reduction, and green cloud energy efficiency.',
    skills: [
      'Distributed computing',
      'Scalability',
      'Reliability engineering',
      'Cloud cost optimization',
      'Performance optimization',
    ],
    icon: 'Cpu',
  },
  {
    id: 'cybersecurity-privacy-engineering',
    title: 'Cybersecurity & Privacy Engineering',
    category: 'RESEARCH',
    shortDescription:
      'Investigate differential privacy, zero-knowledge proofs, homomorphic encryption, and autonomous defensive threat classification.',
    fullDescription:
      'Research mathematical privacy guarantees in data aggregation, adversarial perturbation defenses, secure enclave computing, and telemetry-based intrusion modeling.',
    skills: [
      'Privacy-preserving AI',
      'Secure system design',
      'Defensive threat detection',
      'Application security research',
      'Security evaluation',
    ],
    icon: 'Lock',
  },
  {
    id: 'hci-ux-research',
    title: 'Human-Computer Interaction & UX Research',
    category: 'RESEARCH',
    shortDescription:
      'Investigate user trust in autonomous software, multimodal input ergonomics, neurodivergent accessibility, and cognitive load.',
    fullDescription:
      'Perform quantitative and qualitative studies evaluating human-AI interaction patterns, task completion efficiency under agentic assistance, and perceptual design systems.',
    skills: [
      'Usability testing',
      'Accessibility',
      'Interaction design',
      'User behavior research',
      'AI-assisted user experiences',
    ],
    icon: 'Eye',
  },
  {
    id: 'emerging-tech-applied-innovation',
    title: 'Emerging Technologies & Applied Innovation',
    category: 'RESEARCH',
    shortDescription:
      'Explore cyber-physical digital twins, ambient computing interfaces, experimental protocol prototypes, and novel systems.',
    fullDescription:
      'Evaluate early-stage technologies, benchmark disruptive paradigms, engineer proof-of-concept prototypes, and assess technological feasibility.',
    skills: [
      'Digital twins',
      'Intelligent automation',
      'Technology prototyping',
      'System integration',
      'Experimental engineering solutions',
    ],
    icon: 'Layers',
  },
];

export const TECHNICAL_DOMAINS = [
  'Software & Web Development',
  'Artificial Intelligence & Machine Learning',
  'Data Engineering & Analytics',
  'Cloud Computing & DevOps',
  'Cybersecurity',
  'UI/UX & Digital Product Design',
  'Quality Engineering & Testing',
  'IT Consulting & Business Analysis',
  'Generative AI & LLM Research',
  'AI Agents & Autonomous Workflows',
  'Cloud & Distributed Systems Research',
  'Emerging Technologies',
  'Other',
];
