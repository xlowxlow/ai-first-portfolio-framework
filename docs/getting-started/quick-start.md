# Quick Start Guide

Build your AI-optimized portfolio in under 5 minutes.

## Step 1: Create Your Portfolio

```bash
# Create a new AI-optimized portfolio
npx create-ai-portfolio@latest my-portfolio

# Navigate to your project
cd my-portfolio
```

The CLI will ask you a few questions:

- **Name:** Your full name
- **Email:** Professional email address
- **Role:** Your job title (e.g., "Full-Stack Developer")
- **Template:** Choose from available templates
- **AI Optimization:** Enable AI-specific features (recommended: Yes)
- **Deploy:** Choose deployment platform (optional)

## Step 2: Start Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Your portfolio will be available at `http://localhost:3000` 🎉

## Step 3: Customize Your Content

### Edit Personal Information

```typescript
// src/data/profile.ts
export const profile = {
  name: "Your Name",
  email: "you@example.com",
  role: "Your Role",
  bio: "Brief description about yourself",
  location: "Your Location",
  website: "https://yourwebsite.com",
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername"
  }
}
```

### Add Your Projects

```typescript
// src/data/projects.ts
export const projects = [
  {
    title: "My Awesome Project",
    description: "Brief project description",
    image: "/images/project1.jpg",
    tags: ["React", "TypeScript", "Node.js"],
    github: "https://github.com/yourusername/project",
    demo: "https://project-demo.com",
    featured: true
  }
  // Add more projects...
]
```

### Update Skills

```typescript
// src/data/skills.ts
export const skills = {
  "Frontend": [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Next.js", level: 80 }
  ],
  "Backend": [
    { name: "Node.js", level: 85 },
    { name: "Python", level: 75 },
    { name: "PostgreSQL", level: 80 }
  ]
}
```

## Step 4: Generate AI Content

### Generate llms.txt for AI Discovery

```bash
# Generate AI-readable content
create-ai-portfolio generate llms --language en
```

This creates a `public/llms.txt` file that helps AI systems understand your portfolio:

```
# AI-Readable Portfolio Summary

Name: Alex Chen
Role: Senior Full-Stack Developer
Location: San Francisco, CA
Email: alex@example.com

## About
Passionate full-stack developer with 8+ years of experience...

## Skills
- Frontend: React, TypeScript, Next.js
- Backend: Node.js, Python, PostgreSQL
- Cloud: AWS, Docker, Kubernetes

## Projects
1. E-commerce Platform - Built with React and Node.js
2. AI Chat Application - Integrated OpenAI GPT-4
3. Portfolio Framework - Open-source project

## Contact
Available for: Full-time opportunities, consulting, open-source collaboration
Response time: Within 24 hours
```

### Generate Structured Data

```bash
# Generate Schema.org structured data
create-ai-portfolio generate schema --types person,website
```

This adds structured data to improve search engine visibility.

## Step 5: Test AI Visibility

```bash
# Test how AI systems see your portfolio
create-ai-portfolio test http://localhost:3000

# Get comprehensive analysis
create-ai-portfolio test --comprehensive --save-report
```

The test will check:
- ✅ llms.txt file exists and is properly formatted
- ✅ Structured data is valid
- ✅ Meta tags are optimized
- ✅ Content is semantically structured
- ✅ Performance meets AI crawler requirements

## Step 6: Deploy Your Portfolio

### Option A: Vercel (Recommended)

```bash
# Deploy to Vercel
create-ai-portfolio deploy vercel

# Or use Vercel CLI directly
npx vercel
```

### Option B: Netlify

```bash
# Deploy to Netlify
create-ai-portfolio deploy netlify

# Or drag & drop the dist/ folder to netlify.com
npm run build
```

### Option C: GitHub Pages

```bash
# Deploy to GitHub Pages
create-ai-portfolio deploy github-pages

# Or manually:
git add .
git commit -m "Initial commit"
git push origin main
# Enable Pages in GitHub repository settings
```

## ✨ You're Done!

Congratulations! Your AI-optimized portfolio is now live and discoverable by:

- 🤖 AI assistants (ChatGPT, Claude, Bard)
- 🔍 Search engines (Google, Bing)
- 💼 Recruitment platforms
- 📊 Analytics tools

## Next Steps

### Customize Further
- 🎨 [Customize Design](../guides/customization.md)
- 🎨 [Create Custom Themes](../guides/theming.md)
- 📝 [Add Blog](../examples/blog-integration.md)
- 📦 [Add Custom Components](../examples/custom-components.md)

### Optimize Performance
- ⚡ [Performance Guide](../guides/performance.md)
- 🚀 [SEO Best Practices](../guides/seo-best-practices.md)
- 🤖 [Advanced AI Optimization](../guides/ai-optimization.md)

### Monitor & Maintain
- 📊 Set up analytics
- 🔄 Regular content updates
- 🎯 Monitor AI visibility scores
- 🔍 Track search rankings

## Common Questions

**Q: How often should I update my portfolio?**
A: Update projects quarterly, regenerate AI content monthly.

**Q: Can I use a custom domain?**
A: Yes! See our [Domain Setup Guide](../deployment/domain-setup.md).

**Q: Is my portfolio mobile-friendly?**
A: Absolutely! All templates are mobile-first and responsive.

**Q: How do I add Google Analytics?**
A: Add your GA ID to the configuration file. See [Analytics Setup](../guides/customization.md#analytics).

**Q: Can I customize the AI content generation?**
A: Yes! See [AI Customization](../guides/ai-optimization.md#customization).

## Need Help?

- 💬 [Join our Discord](https://discord.gg/ai-portfolio)
- 📚 [Read Full Documentation](../README.md)
- 🐛 [Report Issues](https://github.com/ai-portfolio/create-ai-portfolio/issues)
- 📧 [Email Support](mailto:support@ai-portfolio.dev)

---

**Next:** [Project Structure Guide →](project-structure.md)