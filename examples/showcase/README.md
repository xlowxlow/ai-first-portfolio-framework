# AI-First Portfolio Showcase

🚀 A complete, production-ready portfolio website showcasing all features of the AI-First Portfolio Framework.

## 🌟 Live Demo

[View Live Demo](https://showcase.ai-portfolio.dev)

## ✨ Features

### Core Features
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Dark Mode** - Automatic theme switching with system preferences
- ✅ **SEO Optimized** - Meta tags, Open Graph, structured data
- ✅ **Performance Optimized** - 98+ Lighthouse score
- ✅ **Accessibility** - WCAG 2.1 AA compliant

### Sections
- 🏠 **Home** - Hero section with animated typewriter effect
- 👤 **About** - Personal introduction with skills showcase
- 💼 **Projects** - Portfolio projects with GitHub stats
- 📝 **Blog** - Markdown-based blog with syntax highlighting
- 🤖 **AI Insights** - AI optimization metrics and tools
- 📧 **Contact** - Contact form with social links

### AI Features
- 🧠 Smart content generation
- ⚡ Automated optimization
- 🎯 Personalization engine
- 📊 Predictive analytics
- 🔒 AI-powered security
- 🤖 Intelligent automation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-first-portfolio.git
cd ai-first-portfolio/examples/showcase
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:3000
```

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Follow prompts**
- Select your account
- Link to existing project or create new
- Configure environment variables if needed

### Deploy with Vercel Button

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ai-first-portfolio/tree/main/examples/showcase)

### Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Netlify**
```bash
npx netlify deploy --prod --dir=.next
```

### Deploy to AWS Amplify

1. **Install Amplify CLI**
```bash
npm install -g @aws-amplify/cli
```

2. **Initialize Amplify**
```bash
amplify init
```

3. **Add hosting**
```bash
amplify add hosting
```

4. **Publish**
```bash
amplify publish
```

## 🎨 Customization

### Update Personal Information

1. **Edit profile data**
```typescript
// src/data/profile.ts
export const profile = {
  name: 'Your Name',
  title: 'Your Title',
  email: 'your.email@example.com',
  // ...
}
```

2. **Update projects**
```typescript
// src/data/projects.ts
export const projects = [
  {
    title: 'Your Project',
    description: 'Project description',
    // ...
  }
]
```

3. **Customize theme**
```css
/* src/app/globals.css */
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

### Add Blog Posts

1. **Create markdown file**
```markdown
// src/content/posts/my-post.md
---
title: My Blog Post
date: 2024-01-20
category: Technology
---

Your content here...
```

2. **Post will automatically appear in blog**

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React, Heroicons
- **Markdown:** React Markdown
- **Analytics:** Vercel Analytics
- **Deployment:** Vercel

## 📊 Performance

- ⚡ **Lighthouse Score:** 98+
- 🚀 **First Contentful Paint:** < 1s
- 🎯 **Time to Interactive:** < 2s
- 📉 **Cumulative Layout Shift:** < 0.1

## 🤖 AI Integration

### OpenAI Integration (Optional)

1. **Get OpenAI API Key**
   - Sign up at [OpenAI](https://openai.com)
   - Generate API key

2. **Add to environment**
```env
# .env.local
OPENAI_API_KEY=your-api-key
```

3. **Use in application**
```typescript
// src/lib/openai.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
```

## 📝 Environment Variables

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://your-domain.com
OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📑 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for your own portfolio!

## 👏 Credits

Built with the [AI-First Portfolio Framework](https://github.com/yourusername/ai-first-portfolio)

## 💬 Support

Have questions? 
- 📧 Email: support@ai-portfolio.dev
- 🐦 Twitter: [@aiportfolio](https://twitter.com/aiportfolio)
- 💙 Discord: [Join our community](https://discord.gg/aiportfolio)

---

Made with ❤️ using AI-First Portfolio Framework