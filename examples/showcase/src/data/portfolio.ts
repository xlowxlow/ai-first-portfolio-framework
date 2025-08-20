import type { PortfolioConfig } from '../../../../src/config/portfolio.config';

export const portfolioData: PortfolioConfig = {
  personalInfo: {
    name: 'Alex Chen',
    title: 'Senior Full-Stack Developer & AI Enthusiast',
    email: 'alex@alexchen.dev',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA, USA',
    website: 'https://ai-portfolio-showcase.vercel.app',
    linkedin: 'alex-chen-dev',
    github: 'alexchen-dev',
    twitter: 'alexchen_dev',
    bio: 'Passionate full-stack developer with 8+ years of experience building scalable web applications and AI-powered solutions. I specialize in React, Node.js, and modern AI technologies, with a focus on creating user-centric products that solve real-world problems. Currently leading AI integration initiatives at TechCorp and contributing to open-source AI tools.',
    avatar: '/images/alex-avatar.jpg'
  },
  
  skills: [
    { name: 'JavaScript', level: 'Expert', category: 'Frontend', yearsOfExperience: 8 },
    { name: 'TypeScript', level: 'Expert', category: 'Frontend', yearsOfExperience: 6 },
    { name: 'React', level: 'Expert', category: 'Frontend', yearsOfExperience: 7 },
    { name: 'Next.js', level: 'Advanced', category: 'Frontend', yearsOfExperience: 5 },
    { name: 'Vue.js', level: 'Advanced', category: 'Frontend', yearsOfExperience: 4 },
    { name: 'Astro', level: 'Advanced', category: 'Frontend', yearsOfExperience: 2 },
    
    { name: 'Node.js', level: 'Expert', category: 'Backend', yearsOfExperience: 7 },
    { name: 'Python', level: 'Advanced', category: 'Backend', yearsOfExperience: 5 },
    { name: 'Go', level: 'Intermediate', category: 'Backend', yearsOfExperience: 3 },
    { name: 'GraphQL', level: 'Advanced', category: 'Backend', yearsOfExperience: 4 },
    { name: 'REST APIs', level: 'Expert', category: 'Backend', yearsOfExperience: 8 },
    
    { name: 'PostgreSQL', level: 'Advanced', category: 'Database', yearsOfExperience: 6 },
    { name: 'MongoDB', level: 'Advanced', category: 'Database', yearsOfExperience: 5 },
    { name: 'Redis', level: 'Intermediate', category: 'Database', yearsOfExperience: 4 },
    
    { name: 'Docker', level: 'Advanced', category: 'DevOps', yearsOfExperience: 5 },
    { name: 'Kubernetes', level: 'Intermediate', category: 'DevOps', yearsOfExperience: 3 },
    { name: 'AWS', level: 'Advanced', category: 'DevOps', yearsOfExperience: 6 },
    { name: 'Vercel', level: 'Expert', category: 'DevOps', yearsOfExperience: 4 },
    { name: 'GitHub Actions', level: 'Advanced', category: 'DevOps', yearsOfExperience: 4 },
    
    { name: 'Machine Learning', level: 'Intermediate', category: 'AI/ML', yearsOfExperience: 3 },
    { name: 'OpenAI API', level: 'Advanced', category: 'AI/ML', yearsOfExperience: 2 },
    { name: 'LangChain', level: 'Advanced', category: 'AI/ML', yearsOfExperience: 1 },
    { name: 'TensorFlow', level: 'Beginner', category: 'AI/ML', yearsOfExperience: 1 },
    
    { name: 'Figma', level: 'Intermediate', category: 'Design', yearsOfExperience: 4 },
    { name: 'UI/UX Design', level: 'Intermediate', category: 'Design', yearsOfExperience: 5 }
  ],
  
  experience: [
    {
      id: 'exp-1',
      company: 'TechCorp Inc.',
      position: 'Senior Full-Stack Developer & AI Lead',
      startDate: '2021-03-01',
      description: 'Leading a team of 6 developers in building AI-powered SaaS products. Architected and implemented microservices infrastructure serving 100K+ daily active users.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'OpenAI API'],
      achievements: [
        'Increased application performance by 40% through optimization and caching strategies',
        'Led migration from monolith to microservices, reducing deployment time by 60%',
        'Integrated AI features that improved user engagement by 35%',
        'Mentored 4 junior developers and established team coding standards'
      ],
      location: 'San Francisco, CA',
      type: 'Full-time'
    },
    {
      id: 'exp-2',
      company: 'StartupXYZ',
      position: 'Full-Stack Developer',
      startDate: '2019-01-15',
      endDate: '2021-02-28',
      description: 'Developed and maintained multiple web applications for early-stage startup. Built the entire tech stack from scratch and scaled to support 10K+ users.',
      technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Redis', 'Digital Ocean'],
      achievements: [
        'Built MVP that secured $2M Series A funding',
        'Implemented real-time features using WebSocket and Redis',
        'Achieved 99.9% uptime through proper monitoring and alerting',
        'Reduced server costs by 50% through optimization'
      ],
      location: 'San Francisco, CA',
      type: 'Full-time'
    },
    {
      id: 'exp-3',
      company: 'Freelance',
      position: 'Full-Stack Developer',
      startDate: '2017-06-01',
      endDate: '2018-12-31',
      description: 'Provided full-stack development services to various clients, from small businesses to mid-size companies. Specialized in e-commerce and content management systems.',
      technologies: ['React', 'WordPress', 'PHP', 'MySQL', 'WooCommerce'],
      achievements: [
        'Delivered 15+ successful projects with 100% client satisfaction',
        'Built custom e-commerce solutions generating $500K+ in sales',
        'Established long-term partnerships with 5 recurring clients',
        'Developed reusable component library reducing development time by 30%'
      ],
      location: 'Remote',
      type: 'Freelance'
    },
    {
      id: 'exp-4',
      company: 'Digital Agency Pro',
      position: 'Frontend Developer',
      startDate: '2016-01-01',
      endDate: '2017-05-31',
      description: 'Focused on creating responsive, interactive websites for agency clients. Collaborated with designers and backend developers to deliver pixel-perfect implementations.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'SASS', 'Gulp'],
      achievements: [
        'Delivered 25+ responsive websites with cross-browser compatibility',
        'Improved website performance scores by 40% on average',
        'Implemented accessibility standards achieving WCAG 2.1 AA compliance',
        'Created reusable CSS framework adopted across all agency projects'
      ],
      location: 'New York, NY',
      type: 'Full-time'
    }
  ],
  
  education: [
    {
      id: 'edu-1',
      institution: 'University of California, Berkeley',
      degree: 'Master of Science',
      field: 'Computer Science',
      startDate: '2014-09-01',
      endDate: '2016-05-15',
      gpa: 3.8,
      achievements: [
        'Thesis: "Optimizing Machine Learning Models for Web Applications"',
        'Teaching Assistant for Data Structures and Algorithms course',
        'President of Computer Science Graduate Student Association'
      ],
      location: 'Berkeley, CA'
    },
    {
      id: 'edu-2',
      institution: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2010-09-01',
      endDate: '2014-06-15',
      gpa: 3.7,
      achievements: [
        'Summa Cum Laude graduate',
        'Dean\'s List for 6 consecutive semesters',
        'Co-founder of Stanford Web Development Club'
      ],
      location: 'Stanford, CA'
    }
  ],
  
  projects: [
    {
      id: 'project-1',
      title: 'AI-First Portfolio Generator',
      description: 'An intelligent portfolio website generator that creates AI-optimized personal websites with automatic LLMs.txt generation, Schema.org structured data, and AI crawler simulation. Built to help professionals improve their AI discoverability.',
      technologies: ['TypeScript', 'Astro', 'Node.js', 'Puppeteer', 'Tailwind CSS', 'Commander.js'],
      features: [
        'Multi-language AI content generation (LLMs.txt)',
        'Schema.org structured data generation',
        'AI crawler behavior simulation (OpenAI, Gemini, Claude)',
        'Interactive CLI with deployment automation',
        'Professional portfolio templates',
        'Comprehensive AI visibility reporting'
      ],
      demoUrl: 'https://ai-portfolio-showcase.vercel.app',
      githubUrl: 'https://github.com/alexchen-dev/create-ai-portfolio',
      imageUrl: '/images/projects/ai-portfolio.jpg',
      status: 'Completed',
      startDate: '2024-01-15',
      endDate: '2024-03-30',
      category: 'Open Source Tool'
    },
    {
      id: 'project-2',
      title: 'EcoTrack - Sustainability Dashboard',
      description: 'A comprehensive web application that helps businesses track their environmental impact, carbon footprint, and sustainability goals. Features real-time data visualization, AI-powered recommendations, and compliance reporting.',
      technologies: ['React', 'Next.js', 'PostgreSQL', 'Prisma', 'Chart.js', 'OpenAI API'],
      features: [
        'Real-time environmental metrics tracking',
        'AI-powered sustainability recommendations',
        'Interactive data visualizations and reports',
        'Compliance monitoring and alerts',
        'Team collaboration and goal setting',
        'Third-party integrations (IoT sensors, APIs)'
      ],
      demoUrl: 'https://ecotrack-demo.vercel.app',
      githubUrl: 'https://github.com/alexchen-dev/ecotrack',
      imageUrl: '/images/projects/ecotrack.jpg',
      status: 'Completed',
      startDate: '2023-08-01',
      endDate: '2023-12-15',
      category: 'SaaS Application'
    },
    {
      id: 'project-3',
      title: 'DevFlow - Developer Productivity Suite',
      description: 'An all-in-one productivity platform for software development teams. Combines project management, code review automation, performance analytics, and AI-assisted coding workflows.',
      technologies: ['Vue.js', 'Nuxt.js', 'Node.js', 'GraphQL', 'MongoDB', 'Redis', 'GitHub API'],
      features: [
        'Intelligent project and task management',
        'Automated code review and quality checks',
        'Performance analytics and team insights',
        'AI-powered code suggestions and documentation',
        'Integration with 20+ development tools',
        'Custom workflow automation'
      ],
      demoUrl: 'https://devflow-app.com',
      githubUrl: 'https://github.com/alexchen-dev/devflow',
      imageUrl: '/images/projects/devflow.jpg',
      status: 'In Progress',
      startDate: '2024-02-01',
      category: 'Productivity Tool'
    },
    {
      id: 'project-4',
      title: 'SmartHome IoT Platform',
      description: 'A comprehensive IoT platform for smart home automation with AI-driven energy optimization, security monitoring, and predictive maintenance. Supports 50+ device types and protocols.',
      technologies: ['Python', 'FastAPI', 'React', 'InfluxDB', 'MQTT', 'TensorFlow', 'Docker'],
      features: [
        'Universal device connectivity and control',
        'AI-powered energy optimization algorithms',
        'Predictive maintenance and fault detection',
        'Advanced security and privacy controls',
        'Voice and mobile app interfaces',
        'Custom automation rules engine'
      ],
      demoUrl: 'https://smarthome-demo.alexchen.dev',
      githubUrl: 'https://github.com/alexchen-dev/smarthome-iot',
      imageUrl: '/images/projects/smarthome.jpg',
      status: 'Completed',
      startDate: '2023-03-01',
      endDate: '2023-07-30',
      category: 'IoT Platform'
    },
    {
      id: 'project-5',
      title: 'CodeMentor AI - Programming Tutor',
      description: 'An intelligent programming education platform that provides personalized coding lessons, real-time feedback, and adaptive learning paths. Uses AI to understand student progress and customize curriculum.',
      technologies: ['React', 'Python', 'Django', 'PostgreSQL', 'OpenAI API', 'WebRTC', 'Monaco Editor'],
      features: [
        'Personalized AI tutoring and code review',
        'Interactive coding environment with live feedback',
        'Adaptive learning paths based on progress',
        'Video lessons with AI-generated transcripts',
        'Peer-to-peer study groups and mentoring',
        'Progress tracking and skill assessments'
      ],
      demoUrl: 'https://codementor-ai.com',
      imageUrl: '/images/projects/codementor.jpg',
      status: 'Completed',
      startDate: '2022-09-01',
      endDate: '2023-02-28',
      category: 'EdTech Platform'
    }
  ],
  
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      date: '2023-06-15',
      credentialId: 'AWS-SAP-2023-AC-001',
      credentialUrl: 'https://aws.amazon.com/verification',
      expirationDate: '2026-06-15'
    },
    {
      id: 'cert-2',
      name: 'Google Cloud Professional Cloud Architect',
      issuer: 'Google Cloud',
      date: '2023-03-20',
      credentialId: 'GCP-PCA-2023-AC-002',
      credentialUrl: 'https://cloud.google.com/certification'
    },
    {
      id: 'cert-3',
      name: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      date: '2022-11-10',
      credentialId: 'CKA-2022-AC-003',
      credentialUrl: 'https://training.linuxfoundation.org/certification/verify'
    }
  ],
  
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#64748b',
    accentColor: '#f59e0b',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter, sans-serif'
  },
  
  sections: {
    showAbout: true,
    showSkills: true,
    showExperience: true,
    showEducation: true,
    showProjects: true,
    showCertifications: true,
    showContact: true
  }
};