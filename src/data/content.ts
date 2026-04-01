import { Briefcase, GraduationCap, User, FileText, Code, Mail, Github, Linkedin, ExternalLink } from 'lucide-react';

export const personalInfo = {
  name: "Your Name",
  title: "Full Stack Developer",
  email: "your.email@example.com",
  location: "City, Country",
  bio: "A passionate developer with experience in building modern web applications. I love solving complex problems and learning new technologies.",
  socials: [
    { name: 'GitHub', url: 'https://github.com', icon: Github },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: Linkedin },
    { name: 'Email', url: 'mailto:your.email@example.com', icon: Mail },
  ]
};

export const navigation = [
  { name: 'About', href: '/', icon: User },
  { name: 'Resume', href: '/resume', icon: Briefcase },
  { name: 'Portfolio', href: '/portfolio', icon: Code },
  { name: 'Cover Letter', href: '/cover-letter', icon: FileText },
];

export const experience = [
  {
    company: "Tech Solutions Inc.",
    role: "Senior Developer",
    period: "2021 - Present",
    description: "Leading the frontend team in developing high-performance React applications.",
    achievements: [
      "Reduced load times by 40% using code splitting and lazy loading.",
      "Mentored 5 junior developers and improved team velocity by 20%.",
    ]
  },
  {
    company: "Creative Web Agency",
    role: "Full Stack Developer",
    period: "2018 - 2021",
    description: "Developed custom CMS solutions for various international clients.",
    achievements: [
      "Built a scalable API using Node.js and Express.",
      "Implemented responsive designs for 50+ client websites.",
    ]
  }
];

export const education = [
  {
    school: "University of Technology",
    degree: "B.S. in Computer Science",
    period: "2014 - 2018",
    description: "Focused on software engineering and data structures."
  }
];

export const skills = {
  frontend: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Framer Motion"],
  backend: ["Node.js", "Express", "PostgreSQL", "MongoDB", "GraphQL"],
  tools: ["Git", "Docker", "AWS", "Figma", "Vercel"]
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

export const coverLetterTemplate = {
  greeting: "Dear Hiring Manager,",
  body: `I am writing to express my strong interest in the [Position Name] role at [Company Name]. With my background in [Your Key Skill] and my passion for [Your Passion], I am confident that I would be a valuable asset to your team.

In my previous role at [Previous Company], I successfully [Achievement], which resulted in [Result]. I am particularly drawn to [Company Name] because of your commitment to [Company Value/Project].

Thank you for considering my application. I look forward to the possibility of discussing how my skills and experience can benefit your team.`,
  closing: "Sincerely,",
  signature: "Your Name"
};
