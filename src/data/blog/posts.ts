export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "future-of-web-development",
    title: "The Future of Web Development",
    excerpt: "Exploring the latest trends in frontend frameworks and the rise of AI-driven development.",
    date: "March 15, 2026",
    category: "Technology",
    image: "https://picsum.photos/seed/webdev/800/600",
    content: `
# The Future of Web Development

The landscape of web development is shifting faster than ever. From the rise of **AI-driven development** to the evolution of frontend frameworks, staying ahead of the curve is both a challenge and an opportunity.

## 1. AI-Powered Coding
Tools like GitHub Copilot and specialized AI coding assistants are no longer just novelties; they are becoming essential parts of the developer's toolkit. They help us write boilerplate code faster, debug complex issues, and even suggest architectural improvements.

## 2. Server-Side Rendering (SSR) and Edge Computing
We're seeing a massive shift back towards server-side logic, but with a modern twist. Frameworks like Next.js and Remix are leading the charge, utilizing edge computing to deliver content faster than ever by running code closer to the user.

## 3. The Rise of TypeScript
TypeScript has officially moved from "nice to have" to "industry standard." The safety and developer experience it provides are unmatched, especially in large-scale applications.

### Conclusion
The future is bright, but it requires continuous learning. Whether it's mastering a new framework or integrating AI into your workflow, the key is to stay curious and keep building.
    `
  },
  {
    id: 2,
    slug: "mastering-tailwind-css",
    title: "Mastering Tailwind CSS",
    excerpt: "Tips and tricks for building beautiful, responsive interfaces faster than ever before.",
    date: "February 28, 2026",
    category: "Design",
    image: "https://picsum.photos/seed/tailwind/800/600",
    content: `
# Mastering Tailwind CSS

Tailwind CSS has revolutionized the way we think about styling. By providing low-level utility classes, it allows us to build custom designs without ever leaving our HTML.

## Why Tailwind?
Unlike traditional CSS frameworks that give you pre-designed components (like buttons or cards), Tailwind gives you the building blocks. This means your site won't look like every other site on the web.

### Key Benefits:
- **No more naming classes**: You don't have to spend hours thinking of names like \`card-container-inner-wrapper\`.
- **Responsive design made easy**: Use prefixes like \`md:\` or \`lg:\` to apply styles at different breakpoints.
- **Maintainability**: Since styles are co-located with your HTML, it's much easier to see what's going on.

## Advanced Tips
1. **Use the \`@theme\` block**: Customize your colors, fonts, and spacing in your CSS file using the new Tailwind 4.0 syntax.
2. **Leverage plugins**: There are amazing plugins for typography, forms, and aspect ratios that can save you tons of time.

Tailwind is more than just a tool; it's a workflow. Once you get used to it, you'll never want to go back to traditional CSS.
    `
  },
  {
    id: 3,
    slug: "why-typescript-is-a-must-have",
    title: "Why TypeScript is a Must-Have",
    excerpt: "How static typing can save you hours of debugging and improve your code quality.",
    date: "January 10, 2026",
    category: "Programming",
    image: "https://picsum.photos/seed/typescript/800/600",
    content: `
# Why TypeScript is a Must-Have

If you're still writing plain JavaScript for large projects, you're missing out on one of the most powerful tools in the modern developer's arsenal: **TypeScript**.

## What is TypeScript?
At its core, TypeScript is JavaScript with **static types**. It allows you to define the shape of your data, ensuring that you don't accidentally pass a string where a number is expected.

### 1. Catch Errors Early
The most obvious benefit is catching errors during development rather than at runtime. If you try to access a property that doesn't exist on an object, TypeScript will let you know immediately.

### 2. Better Tooling and Autocomplete
Because TypeScript understands your code's structure, your IDE can provide much better autocomplete suggestions. This makes exploring new libraries and refactoring old code a breeze.

### 3. Documentation as Code
Types serve as a form of documentation that never goes out of date. When you look at a function signature in TypeScript, you know exactly what it needs and what it returns.

## Getting Started
Switching to TypeScript doesn't have to be an all-or-nothing affair. You can start by adding it to a small part of your project and gradually expand its usage.

**Trust me, your future self will thank you.**
    `
  }
];
