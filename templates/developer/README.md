# Developer Portfolio Template

A modern, responsive portfolio template built with Astro, featuring AI-optimized content generation, dark mode support, and exceptional performance.

## 🚀 Features

### ✨ Core Components
- **Responsive Layout** - Mobile-first design with Tailwind CSS
- **Dark Mode Support** - Seamless theme switching with system preference detection
- **Project Showcase** - Interactive grid with filtering and lazy loading
- **Skills Matrix** - Multiple display types (bars, circles, tags, grid)
- **Blog Integration** - Full-featured blog with categorization and search
- **AI-Friendly Contact Form** - Advanced form validation and spam protection
- **Performance Optimized** - Lazy loading, image optimization, and Core Web Vitals tracking

### 🤖 AI Integration
- **Structured Data** - Schema.org markup for better SEO
- **LLMs.txt Generation** - AI-readable portfolio summaries
- **Semantic HTML** - Fully accessible and semantic markup
- **Meta Optimization** - Comprehensive SEO and social media tags

### ⚡ Performance
- **Lazy Loading** - Images and components load on demand
- **Code Splitting** - Dynamic imports for better bundle size
- **Image Optimization** - WebP/AVIF support with responsive images
- **Service Worker** - Caching and offline support
- **Core Web Vitals** - Monitoring and optimization

## 📁 Project Structure

```
templates/developer/
├── components/           # Reusable Astro components
│   ├── BaseLayout.astro  # Main layout with navigation
│   ├── ProjectShowcase.astro  # Project grid with filtering
│   ├── SkillsMatrix.astro     # Skills visualization
│   ├── BlogList.astro         # Blog posts listing
│   ├── ContactForm.astro      # Contact form with validation
│   ├── SEO.astro             # SEO optimization component
│   └── LoadingSpinner.astro   # Loading states
├── layouts/             # Page layouts
│   └── BaseLayout.astro # Main site layout
├── pages/              # Page components
│   └── index.astro     # Homepage
├── utils/              # Utility functions
│   └── performance.ts  # Performance optimization utilities
├── assets/             # Static assets
├── styles/             # Additional CSS styles
└── README.md          # This file
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone or copy the template:**
```bash
cp -r templates/developer my-portfolio
cd my-portfolio
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Configure your portfolio data:**
Edit the `portfolioData` object in `pages/index.astro`:

```javascript
const portfolioData = {
  personalInfo: {
    name: 'Your Name',
    title: 'Your Title',
    bio: 'Your bio...',
    email: 'your.email@example.com',
    // ... more fields
  },
  skills: [
    { name: 'JavaScript', level: 'Expert', category: 'Frontend' },
    // ... more skills
  ],
  projects: [
    {
      title: 'Project Name',
      description: 'Project description...',
      technologies: ['React', 'Node.js'],
      // ... more fields
    }
  ]
};
```

4. **Start development server:**
```bash
npm run dev
# or
yarn dev
```

5. **Build for production:**
```bash
npm run build
# or  
yarn build
```

## 🎨 Customization

### Colors & Theming
The template uses Tailwind CSS with custom color schemes. Modify the theme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      }
    }
  }
}
```

### Component Configuration

#### Project Showcase
```astro
<ProjectShowcase 
  projects={portfolioData.projects}
  showFilters={true}
  itemsPerPage={6}
  layout="grid" // 'grid' | 'masonry' | 'list'
  showFeaturedFirst={true}
/>
```

#### Skills Matrix
```astro
<SkillsMatrix 
  skills={portfolioData.skills}
  displayType="bars" // 'bars' | 'circles' | 'tags' | 'grid'
  groupByCategory={true}
  showProficiencyLevel={true}
  showYearsOfExperience={true}
/>
```

#### Blog List
```astro
<BlogList 
  posts={portfolioData.blogPosts}
  showFeaturedFirst={true}
  itemsPerPage={3}
  layout="grid" // 'grid' | 'masonry' | 'list'
  showCategories={true}
  showTags={true}
/>
```

#### Contact Form
```astro
<ContactForm 
  showMap={false}
  socialLinks={{
    email: 'your.email@example.com',
    linkedin: 'https://linkedin.com/in/yourprofile'
  }}
  businessHours={{
    timezone: 'PST (UTC-8)',
    schedule: [
      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' }
    ]
  }}
/>
```

## 🔧 Advanced Configuration

### Performance Optimization
The template includes comprehensive performance optimizations:

```typescript
import { initializePerformanceOptimizations } from './utils/performance';

// Initialize all performance features
initializePerformanceOptimizations();
```

### SEO Configuration
Add SEO meta tags to any page:

```astro
---
import SEO from '../components/SEO.astro';
---

<SEO 
  title="Page Title"
  description="Page description..."
  keywords={['keyword1', 'keyword2']}
  ogImage="/images/page-og.jpg"
  structuredData={structuredDataObject}
/>
```

### Structured Data
The template automatically generates Schema.org structured data:

- Person schema for personal information
- CreativeWork schema for projects  
- BlogPosting schema for blog posts
- BreadcrumbList for navigation
- ContactPoint for contact information

### Dark Mode
Dark mode is automatically handled with:
- System preference detection
- Local storage persistence
- Smooth transitions
- All components support both themes

## 📱 Responsive Design

The template is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px  
- Desktop: 1024px - 1280px
- Wide: > 1280px

## ♿ Accessibility

- **WCAG 2.1 AA compliant**
- **Semantic HTML** throughout
- **ARIA labels** and roles
- **Keyboard navigation** support
- **Screen reader** optimization
- **Focus management**
- **High contrast** support
- **Reduced motion** preferences

## 🚀 Deployment

### Build Command
```bash
npm run build
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 📊 Analytics Integration

### Google Analytics 4
Add to your layout head:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Core Web Vitals Tracking
The template includes built-in Core Web Vitals monitoring:

```typescript
import { PerformanceMonitor } from './utils/performance';

// Get Core Web Vitals
const vitals = await PerformanceMonitor.getCoreWebVitals();
console.log('LCP:', vitals.LCP);
console.log('FID:', vitals.FID);  
console.log('CLS:', vitals.CLS);
```

## 🔍 SEO Features

- **Meta tags** optimization
- **Open Graph** tags for social sharing
- **Twitter Cards** support
- **Structured data** (JSON-LD)
- **Sitemap** generation
- **Robots.txt** configuration
- **Canonical URLs**
- **Alt text** for images
- **Semantic HTML**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This template is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you need help with this template:

1. Check the [documentation](docs/)
2. Search [existing issues](issues)
3. Create a [new issue](issues/new)
4. Join our [Discord community](https://discord.gg/portfolio)

## 🎯 Roadmap

- [ ] Multiple template variants
- [ ] CMS integration (Sanity, Contentful)
- [ ] Blog commenting system
- [ ] Newsletter integration
- [ ] E-commerce features
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Advanced animations

---

**Made with ❤️ using Astro, Tailwind CSS, and modern web technologies.**