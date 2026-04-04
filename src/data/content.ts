import { Briefcase, GraduationCap, User, FileText, Code, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

export const navigation = [
  { name: 'About', href: '/', icon: User },
  { name: 'Resume', href: '/resume', icon: Briefcase },
  { name: 'Portfolio', href: '/portfolio', icon: Code },
  { name: 'Blog', href: '/blog', icon: notebook-pen },
  { name: 'Cover Letter', href: '/cover-letter', icon: FileText },
];

export const personalInfo = {
  name: "Ryan Conn",
  title: "Strategy & Operations Analayst",
  email: "ryanmconn@gmail.com",
  location: "Denver, CO",
  bio: "A passionate developer with experience in building modern web applications. I love solving complex problems and learning new technologies.",
  socials: [
    { name: 'GitHub', url: 'https://github.com/cultofyumyum/', icon: Github },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/ryan-conn-737491bb/', icon: Linkedin },
    { name: 'Email', url: 'mailto:ryanmconn@gmail.com', icon: Mail },
  ]
};

export const experience = [
  {
    company: "Uber",
    role: "Senior Strategy & Operations Manager",
    period: "2020 - Present",
    description: "Description of role",
    achievements: [
      "Reduced load times by 40% using code splitting and lazy loading.",
      "Mentored 5 junior developers and improved team velocity by 20%.",
    ]
  },
  {
    company: "Routematch Software",
    role: "Implementation Project Manager",
    period: "2015 - 2020",
    description: "Description of role",
    achievements: [
      "Built a scalable API using Node.js and Express.",
      "Implemented responsive designs for 50+ client websites.",
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
