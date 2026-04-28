import { Briefcase, GraduationCap, User, FileText, Code, Mail, Github, Linkedin, ExternalLink, NotebookPen } from 'lucide-react';

export const navigation = [
  { name: 'About', href: '/', icon: User },
  { name: 'Resume', href: '/resume', icon: Briefcase },
  //{ name: 'Portfolio', href: '/portfolio', icon: Code },
  //{ name: 'Cover Letter', href: '/cover-letter', icon: FileText },
  //{ name: 'Blog', href: '/blog', icon: NotebookPen },
];

export const personalInfo = {
  name: "Ryan Conn",
  title: "Strategy & Product Operations",
  email: "ryanmconn@gmail.com",
  location: "Denver, CO",
  bio: "Strategy & Product Operations with a focus on making sure things work the way customers need.",
  socials: [
    { name: 'GitHub', url: 'https://github.com/cultofyumyum/', icon: Github },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ryan-conn-737491bb/', icon: Linkedin },
    { name: 'Email', url: 'mailto:ryanmconn@gmail.com', icon: Mail },
  ]
};

export const experience = [
  {
    company: "Uber",
    role: "Strategy & Operations Manager",
    period: "2020 - Present",
    description: "Oversee and develop Customer Support Operational processes for US&C Transit Organizations, totaling over $200M ARR.",
    achievements: [
      "Develop Reporting schema, Dashboards, and SOPs to create internal self service BI platform to monitor customer health and account growth.",
      "Perform market analysis to convert customer feedback into Product Requirement documentation for future development.",
      "Lead Product GTM managing a global team of cross-functional operational teams, as well as developing KPIs for product launch and adoption."//,
      //"Developed a ML tool used by Sales teams to predict fares for rides given a variety of environmental inputs."
    ]
  },
  {
    company: "Routematch Software",
    role: "Implementation Project Manager",
    period: "2015 - 2020",
    description: "Leading new projects and acting as a technical resource for deployments and retention for over 400 Transit Sites in the US, Canada, and Australia.",
    achievements: [
      "Managed the deployment, configuration, and implementation of SaaS platforms across the lifespan of the project.",
      "Utilized Transact-SQL to architect system designs for Software-Network communications and integration, as well as software configuration for end-users.",
      "Managing switchover from legacy systems to ensure seamless service delivery to thousands of daily users.",
      "Developed internal tool to access APIs to reduce new tenancy creation by 90%."
    ]
  }
];

export const education = [
  {
    school: "University of Georgia",
    degree: ["BA in Sociology"
      , "BSc in Geographic Information Systems"],
    period: "2009 - 2013",
    description: "Focus on how groups and societies use technology for communication."
  }
];

export const skills = {
  frontend: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Framer Motion"],
  backend: ["MS SQL Server", "Express", "PostgreSQL", "MongoDB", "GraphQL"],
  tools: ["Git", "Docker", "Figma", "Postman"]
};

export const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-featured online store with payment integration and real-time inventory.",
    tech: ["React", "Node.js", "Stripe", "Tailwind"],
    link: "https://github.com",
    image: "https://picsum.photos/seed/ecommerce/800/600"
  },
  {
    title: "Task Management App",
    description: "A collaborative tool for teams to manage projects and track time.",
    tech: ["TypeScript", "Firebase", "React"],
    link: "https://github.com",
    image: "https://picsum.photos/seed/tasks/800/600"
  }
];

import { blogPosts } from './blog/posts';

export const coverLetterTemplate = {
  greeting: "Dear Hiring Manager,",
  body: `I am writing to express my strong interest in the [Position Name] role at [Company Name]. With my background in [Your Key Skill] and my passion for [Your Passion], I am confident that I would be a valuable asset to your team.

In my previous role at [Previous Company], I successfully [Achievement], which resulted in [Result]. I am particularly drawn to [Company Name] because of your commitment to [Company Value/Project].

Thank you for considering my application. I look forward to the possibility of discussing how my skills and experience can benefit your team.`,
  closing: "Sincerely,",
  signature: "Your Name"
};
