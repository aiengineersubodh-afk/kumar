// Service Field Background Image Resolver & Mapping Engine
// Maps all 13 enterprise categories and 78 specialized sub-disciplines to verified public assets.

export interface ServiceHeroImageResult {
  src: string | null;
  categoryFolder: string;
  fileName: string | null;
  hasCustomImage: boolean;
  alt: string;
}

// Complete deterministic map for all 78 verified service field background images across 13 categories.
// Public root: /images/services/<Category Folder>/<File Name>
const VERIFIED_SERVICE_IMAGES: Record<
  string,
  { categoryFolder: string; fileName: string }
> = {
  // 1. Artificial Intelligence & Data (6 services)
  'ai-solutions-and-generative-ai': {
    categoryFolder: 'Artificial Intelligence & Data',
    fileName: 'AI Solutions & Generative AI Company.png',
  },
  'ai-agents-and-intelligent-automation': {
    categoryFolder: 'Artificial Intelligence & Data',
    fileName: 'AI Agents & Intelligent Automation Company.png',
  },
  'machine-learning-and-predictive-analytics': {
    categoryFolder: 'Artificial Intelligence & Data',
    fileName: 'Machine Learning & Predictive Analytics Company.png',
  },
  'data-engineering-and-business-intelligence': {
    categoryFolder: 'Artificial Intelligence & Data',
    fileName: 'Data Engineering & Business Intelligence Company.png',
  },
  'enterprise-ai-integration': {
    categoryFolder: 'Artificial Intelligence & Data',
    fileName: 'Enterprise AI Integration Company.png',
  },
  'ai-strategy-and-consulting': {
    categoryFolder: 'Artificial Intelligence & Data',
    fileName: 'AI Strategy & Consulting Company.png',
  },

  // 2. Cloud & DevOps (6 services)
  'cloud-strategy-and-consulting': {
    categoryFolder: 'Cloud & DevOps',
    fileName: 'Cloud Strategy & Consulting.png',
  },
  'cloud-migration-and-modernization': {
    categoryFolder: 'Cloud & DevOps',
    fileName: 'Cloud Migration & Modernization.png',
  },
  'aws-azure-and-google-cloud-solutions': {
    categoryFolder: 'Cloud & DevOps',
    fileName: 'AWS, Azure & Google Cloud Solutions.png',
  },
  'devops-and-ci-cd-automation': {
    categoryFolder: 'Cloud & DevOps',
    fileName: 'DevOps & CICD Automation.png',
  },
  'cloud-infrastructure-and-architecture': {
    categoryFolder: 'Cloud & DevOps',
    fileName: 'Cloud Infrastructure & Architecture.png',
  },
  'managed-cloud-services': {
    categoryFolder: 'Cloud & DevOps',
    fileName: 'Managed Cloud Services.png',
  },

  // 3. Software & Product Engineering (6 services)
  'custom-software-development': {
    categoryFolder: 'Software & Product Engineering',
    fileName: 'Custom Software Development.png',
  },
  'web-application-development': {
    categoryFolder: 'Software & Product Engineering',
    fileName: 'Web Application Development.png',
  },
  'mobile-app-development': {
    categoryFolder: 'Software & Product Engineering',
    fileName: 'Mobile App Development.png',
  },
  'saas-and-digital-product-development': {
    categoryFolder: 'Software & Product Engineering',
    fileName: 'SaaS & Digital Product Development.png',
  },
  'api-development-and-system-integration': {
    categoryFolder: 'Software & Product Engineering',
    fileName: 'API Development & System Integration.png',
  },
  'legacy-application-modernization': {
    categoryFolder: 'Software & Product Engineering',
    fileName: 'Legacy Application Modernization.png',
  },

  // 4. Cybersecurity (6 services)
  'cybersecurity-strategy-and-risk-assessment': {
    categoryFolder: 'Cybersecurity',
    fileName: 'Cybersecurity Strategy & Risk Assessment.png',
  },
  'application-and-cloud-security': {
    categoryFolder: 'Cybersecurity',
    fileName: 'Application & Cloud Security.jpg',
  },
  'identity-and-access-management': {
    categoryFolder: 'Cybersecurity',
    fileName: 'Identity & Access Management.webp',
  },
  'threat-detection-and-incident-response': {
    categoryFolder: 'Cybersecurity',
    fileName: 'Threat Detection & Incident Response.png',
  },
  'data-protection-and-privacy': {
    categoryFolder: 'Cybersecurity',
    fileName: 'Data Protection & Privacy.webp',
  },
  'security-compliance-and-governance': {
    categoryFolder: 'Cybersecurity',
    fileName: 'Security Compliance & Governance.jpg',
  },

  // 5. Data Engineering & Analytics (6 services)
  'data-platforms-and-architecture': {
    categoryFolder: 'Data Engineering & Analytics',
    fileName: 'Data Platforms & Architecture.webp',
  },
  'data-integration-and-engineering': {
    categoryFolder: 'Data Engineering & Analytics',
    fileName: 'Data Integration & Engineering.jpg',
  },
  'data-warehousing-and-lakehouse-solutions': {
    categoryFolder: 'Data Engineering & Analytics',
    fileName: 'Data Warehousing & Lakehouse Solutions.png',
  },
  'business-intelligence-and-dashboards': {
    categoryFolder: 'Data Engineering & Analytics',
    fileName: 'Business Intelligence & Dashboards.webp',
  },
  'predictive-and-prescriptive-analytics': {
    categoryFolder: 'Data Engineering & Analytics',
    fileName: 'Predictive & Prescriptive Analytics.jpg',
  },
  'data-governance-and-quality': {
    categoryFolder: 'Data Engineering & Analytics',
    fileName: 'Data Governance & Quality.webp',
  },

  // 6. Digital Experience & Design (6 services)
  'ui-ux-design-and-research': {
    categoryFolder: 'Digital Experience & Design',
    fileName: 'UIUX Design & Research.png',
  },
  'website-design-and-development': {
    categoryFolder: 'Digital Experience & Design',
    fileName: 'Website Design & Development.jpg',
  },
  'mobile-experience-design': {
    categoryFolder: 'Digital Experience & Design',
    fileName: 'Mobile Experience Design.png',
  },
  'digital-product-prototyping': {
    categoryFolder: 'Digital Experience & Design',
    fileName: 'Digital Product Prototyping.jpg',
  },
  'design-systems-and-accessibility': {
    categoryFolder: 'Digital Experience & Design',
    fileName: 'Design Systems & Accessibility.png',
  },
  'product-experience-optimization': {
    categoryFolder: 'Digital Experience & Design',
    fileName: 'Product Experience Optimization.webp',
  },

  // 7. Enterprise Solutions (6 services)
  'erp-implementation-and-integration': {
    categoryFolder: 'Enterprise Solutions',
    fileName: 'ERP Implementation & Integration.jpg',
  },
  'crm-solutions': {
    categoryFolder: 'Enterprise Solutions',
    fileName: 'CRM Solutions.webp',
  },
  'enterprise-application-development': {
    categoryFolder: 'Enterprise Solutions',
    fileName: 'Enterprise Application Development.png',
  },
  'business-management-systems': {
    categoryFolder: 'Enterprise Solutions',
    fileName: 'Business Management Systems.webp',
  },
  'enterprise-api-and-data-integration': {
    categoryFolder: 'Enterprise Solutions',
    fileName: 'Enterprise API & Data Integration.png',
  },
  'enterprise-platform-modernization': {
    categoryFolder: 'Enterprise Solutions',
    fileName: 'Enterprise Platform Modernization.webp',
  },

  // 8. Business Process Automation (6 services)
  'intelligent-workflow-automation': {
    categoryFolder: 'Business Process Automation',
    fileName: 'Intelligent Workflow Automation.jpg',
  },
  'robotic-process-automation-rpa': {
    categoryFolder: 'Business Process Automation',
    fileName: 'Robotic Process Automation (RPA).jpg',
  },
  'ai-powered-business-operations': {
    categoryFolder: 'Business Process Automation',
    fileName: 'AI-Powered Business Operations.jpg',
  },
  'document-and-data-processing-automation': {
    categoryFolder: 'Business Process Automation',
    fileName: 'Document & Data Processing Automation.jpeg',
  },
  'crm-and-erp-workflow-automation': {
    categoryFolder: 'Business Process Automation',
    fileName: 'CRM & ERP Workflow Automation.jpg',
  },
  'process-optimization-and-consulting': {
    categoryFolder: 'Business Process Automation',
    fileName: 'Process Optimization & Consulting.webp',
  },

  // 9. IT Consulting & Digital Transformation (6 services)
  'technology-strategy-and-roadmaps': {
    categoryFolder: 'IT Consulting & Digital Transformation',
    fileName: 'Technology Strategy & Roadmaps.png',
  },
  'digital-transformation-consulting': {
    categoryFolder: 'IT Consulting & Digital Transformation',
    fileName: 'Digital Transformation Consulting.png',
  },
  'business-process-consulting': {
    categoryFolder: 'IT Consulting & Digital Transformation',
    fileName: 'Business Process Consulting.webp',
  },
  'enterprise-architecture': {
    categoryFolder: 'IT Consulting & Digital Transformation',
    fileName: 'Enterprise Architecture.jpg',
  },
  'technology-assessment-and-advisory': {
    categoryFolder: 'IT Consulting & Digital Transformation',
    fileName: 'Technology Assessment & Advisory.webp',
  },
  'project-and-program-management': {
    categoryFolder: 'IT Consulting & Digital Transformation',
    fileName: 'Project & Program Management.webp',
  },

  // 10. Quality Engineering & Testing (6 services)
  'software-quality-assurance': {
    categoryFolder: 'Quality Engineering & Testing',
    fileName: 'Software Quality Assurance.png',
  },
  'automated-testing': {
    categoryFolder: 'Quality Engineering & Testing',
    fileName: 'Automated Testing.jpg',
  },
  'api-and-integration-testing': {
    categoryFolder: 'Quality Engineering & Testing',
    fileName: 'API & Integration Testing.jpg',
  },
  'performance-and-scalability-testing': {
    categoryFolder: 'Quality Engineering & Testing',
    fileName: 'Quality Engineering & Testing.png',
  },
  'mobile-and-web-application-testing': {
    categoryFolder: 'Quality Engineering & Testing',
    fileName: 'Mobile & Web Application Testing.png',
  },
  'continuous-testing-and-quality-engineering': {
    categoryFolder: 'Quality Engineering & Testing',
    fileName: 'Continuous Testing & Quality Engineering.jpg',
  },

  // 11. Managed IT & Technology Operations (6 services)
  'managed-it-services': {
    categoryFolder: 'Managed IT & Technology Operations',
    fileName: 'Managed IT Services.png',
  },
  'infrastructure-and-network-management': {
    categoryFolder: 'Managed IT & Technology Operations',
    fileName: 'Infrastructure & Network Management.png',
  },
  'application-support-and-maintenance': {
    categoryFolder: 'Managed IT & Technology Operations',
    fileName: 'Application Support & Maintenance.webp',
  },
  'cloud-and-database-operations': {
    categoryFolder: 'Managed IT & Technology Operations',
    fileName: 'Cloud & Database Operations.jpg',
  },
  'it-service-desk-and-technical-support': {
    categoryFolder: 'Managed IT & Technology Operations',
    fileName: 'IT Service Desk & Technical Support.jpg',
  },
  'monitoring-backup-and-disaster-recovery': {
    categoryFolder: 'Managed IT & Technology Operations',
    fileName: 'Monitoring, Backup & Disaster Recovery.jpg',
  },

  // 12. Engineering & Emerging Technologies (6 services)
  'internet-of-things-iot': {
    categoryFolder: 'Engineering & Emerging Technologies',
    fileName: 'Internet of Things (IoT).jpg',
  },
  'embedded-systems-and-firmware': {
    categoryFolder: 'Engineering & Emerging Technologies',
    fileName: 'Embedded Systems & Firmware.jpg',
  },
  'industrial-automation-and-industry-4-0': {
    categoryFolder: 'Engineering & Emerging Technologies',
    fileName: 'Industrial Automation & Industry 4.0.jpg',
  },
  'research-and-product-engineering': {
    categoryFolder: 'Engineering & Emerging Technologies',
    fileName: 'Research & Product Engineering.webp',
  },
  'robotics-and-intelligent-systems': {
    categoryFolder: 'Engineering & Emerging Technologies',
    fileName: 'Robotics & Intelligent Systems.jpg',
  },
  'ar-vr-and-digital-twin-solutions': {
    categoryFolder: 'Engineering & Emerging Technologies',
    fileName: 'ARVR & Digital Twin Solutions.png',
  },

  // 13. Industry-Specific Solutions (6 services)
  'banking-and-financial-services': {
    categoryFolder: 'Industry-Specific Solutions',
    fileName: 'Banking & Financial Services.jpg',
  },
  'healthcare-and-life-sciences': {
    categoryFolder: 'Industry-Specific Solutions',
    fileName: 'Healthcare & Life Sciences.png',
  },
  'retail-and-e-commerce': {
    categoryFolder: 'Industry-Specific Solutions',
    fileName: 'Retail & E-commerce.png',
  },
  'manufacturing-and-supply-chain': {
    categoryFolder: 'Industry-Specific Solutions',
    fileName: 'Manufacturing & Supply Chain.jpg',
  },
  'education-and-edtech': {
    categoryFolder: 'Industry-Specific Solutions',
    fileName: 'Education & EdTech.webp',
  },
  'logistics-transportation-and-mobility': {
    categoryFolder: 'Industry-Specific Solutions',
    fileName: 'Logistics, Transportation & Mobility.jpg',
  },
};

/**
 * Normalizes strings by lowercasing, replacing ampersands with 'and',
 * removing punctuation, stripping extraneous 'company' labels, and collapsing whitespace.
 */
export function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/&/g, 'and')
    .replace(/[/\\#,+()$~%.'":*?<>{}_-]/g, '')
    .replace(/\bcompany\b/g, '')
    .replace(/\s+/g, '')
    .trim();
}

/**
 * Encodes individual path segments (properly escaping spaces to %20 and & to %26)
 * avoiding double encoding and ensuring direct browser URL compatibility.
 */
function buildPublicAssetUrl(categoryFolder: string, fileName: string): string {
  return `/images/services/${encodeURIComponent(categoryFolder)}/${encodeURIComponent(fileName)}`;
}

/**
 * Resolves the service hero background image for a given subservice slug,
 * category title, and service title.
 * Handles existing verified files, future normalized additions, and safe fallbacks.
 */
export function getServiceHeroImage(
  slug: string,
  categoryTitle?: string,
  serviceTitle?: string
): ServiceHeroImageResult {
  // 1. Direct lookup by known slug (Covers all 78 verified service fields)
  const directMatch = VERIFIED_SERVICE_IMAGES[slug];
  if (directMatch) {
    return {
      src: buildPublicAssetUrl(directMatch.categoryFolder, directMatch.fileName),
      categoryFolder: directMatch.categoryFolder,
      fileName: directMatch.fileName,
      hasCustomImage: true,
      alt: serviceTitle ? `${serviceTitle} Enterprise Architecture` : 'ManyMorgan Service Background',
    };
  }

  // 2. Dynamic normalization matcher for any future additions
  if (categoryTitle && serviceTitle) {
    const normalizedTargetTitle = normalizeKey(serviceTitle);
    const normalizedTargetCat = normalizeKey(categoryTitle);

    for (const [sKey, info] of Object.entries(VERIFIED_SERVICE_IMAGES)) {
      if (
        normalizeKey(info.categoryFolder) === normalizedTargetCat &&
        (normalizeKey(sKey) === normalizedTargetTitle ||
          normalizeKey(info.fileName).includes(normalizedTargetTitle) ||
          normalizedTargetTitle.includes(normalizeKey(info.fileName)))
      ) {
        return {
          src: buildPublicAssetUrl(info.categoryFolder, info.fileName),
          categoryFolder: info.categoryFolder,
          fileName: info.fileName,
          hasCustomImage: true,
          alt: `${serviceTitle} Enterprise Architecture`,
        };
      }
    }
  }

  // 3. Graceful fallback when no image exists
  return {
    src: null,
    categoryFolder: categoryTitle || 'General',
    fileName: null,
    hasCustomImage: false,
    alt: serviceTitle ? `${serviceTitle} Overview` : 'ManyMorgan Service',
  };
}

export const VERIFIED_SERVICE_IMAGES_LIST = Object.entries(VERIFIED_SERVICE_IMAGES).map(
  ([slug, data]) => ({
    slug,
    ...data,
  })
);
