import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { calculateReadingTime } from './utils'

export interface Post {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  category: string
  tags: string[]
  image: string
  readTime: string
}

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

export async function getAllPosts(): Promise<Post[]> {
  // For now, return sample posts. In production, read from markdown files
  const samplePosts: Post[] = [
    {
      slug: 'ai-nextjs-openai',
      title: 'Building AI-Powered Applications with Next.js and OpenAI',
      excerpt: 'Learn how to integrate OpenAI GPT-4 into your Next.js applications for intelligent features and enhanced user experiences.',
      content: `# Building AI-Powered Applications with Next.js and OpenAI\n\n## Introduction\n\nArtificial Intelligence is revolutionizing web development, and integrating AI capabilities into your applications has never been easier. In this comprehensive guide, we'll explore how to build powerful AI-driven features using Next.js and OpenAI's GPT-4 API.\n\n## Why Next.js for AI Applications?\n\nNext.js provides the perfect foundation for AI-powered applications:\n\n- **Server-side rendering** for optimal performance\n- **API routes** for secure AI integration\n- **Edge functions** for low-latency AI responses\n- **Built-in optimization** for handling AI-generated content\n\n## Setting Up Your Project\n\nFirst, create a new Next.js project and install the necessary dependencies:\n\n\`\`\`bash\nnpx create-next-app@latest ai-app\ncd ai-app\nnpm install openai\n\`\`\`\n\n## Implementing AI Features\n\n### 1. Content Generation\n\nCreate an API route to handle AI content generation:\n\n\`\`\`typescript\n// app/api/generate/route.ts\nimport OpenAI from 'openai'\n\nconst openai = new OpenAI({\n  apiKey: process.env.OPENAI_API_KEY,\n})\n\nexport async function POST(req: Request) {\n  const { prompt } = await req.json()\n  \n  const completion = await openai.chat.completions.create({\n    model: 'gpt-4',\n    messages: [{ role: 'user', content: prompt }],\n  })\n  \n  return Response.json({ content: completion.choices[0].message.content })\n}\n\`\`\`\n\n### 2. Real-time Streaming\n\nImplement streaming responses for better user experience:\n\n\`\`\`typescript\nexport async function POST(req: Request) {\n  const stream = await openai.chat.completions.create({\n    model: 'gpt-4',\n    messages: messages,\n    stream: true,\n  })\n  \n  return new Response(stream)\n}\n\`\`\`\n\n## Best Practices\n\n1. **Rate limiting**: Implement rate limiting to prevent abuse\n2. **Caching**: Cache AI responses when appropriate\n3. **Error handling**: Gracefully handle API failures\n4. **Cost optimization**: Monitor and optimize API usage\n\n## Conclusion\n\nIntegrating AI into your Next.js applications opens up endless possibilities for creating intelligent, user-centric experiences. Start small, experiment, and gradually expand your AI capabilities as you learn what works best for your users.`,
      date: '2024-01-15',
      author: 'Alex Chen',
      category: 'AI Development',
      tags: ['AI', 'Next.js', 'OpenAI', 'GPT-4', 'Web Development'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop',
      readTime: '8 min read',
    },
    {
      slug: 'future-web-dev-ai',
      title: 'The Future of Web Development: AI-First Approach',
      excerpt: 'Explore how AI is reshaping web development and why adopting an AI-first mindset is crucial for modern developers.',
      content: `# The Future of Web Development: AI-First Approach\n\n## The Paradigm Shift\n\nWeb development is undergoing a fundamental transformation. AI is no longer just a feature—it's becoming the foundation of how we build, deploy, and maintain web applications.\n\n## Key Trends Shaping the Future\n\n### 1. AI-Assisted Coding\n\nDevelopers are increasingly using AI tools for:\n- Code generation and completion\n- Bug detection and fixing\n- Performance optimization\n- Documentation generation\n\n### 2. Intelligent User Experiences\n\nModern web applications leverage AI for:\n- Personalized content delivery\n- Predictive user interfaces\n- Natural language interactions\n- Adaptive layouts and designs\n\n### 3. Automated Testing and Deployment\n\nAI is revolutionizing DevOps:\n- Intelligent test generation\n- Predictive deployment strategies\n- Automated performance tuning\n- Proactive error prevention\n\n## Preparing for the AI-First Future\n\n1. **Learn AI fundamentals**: Understand machine learning basics\n2. **Master AI tools**: Familiarize yourself with AI development platforms\n3. **Ethics and responsibility**: Consider the implications of AI in your work\n4. **Continuous learning**: Stay updated with rapidly evolving AI technologies\n\n## Conclusion\n\nThe future of web development is intelligent, adaptive, and user-centric. By embracing an AI-first approach, developers can create more powerful, efficient, and engaging web experiences.`,
      date: '2024-01-10',
      author: 'Alex Chen',
      category: 'Tech Trends',
      tags: ['AI', 'Future', 'Web Development', 'Technology', 'Innovation'],
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
      readTime: '6 min read',
    },
    {
      slug: 'react-performance',
      title: 'Optimizing React Performance: Advanced Techniques',
      excerpt: 'Deep dive into React performance optimization strategies including code splitting, memoization, and virtual scrolling.',
      content: `# Optimizing React Performance: Advanced Techniques\n\n## Understanding React Performance\n\nReact is fast by default, but as applications grow, performance can degrade. Let's explore advanced techniques to keep your React apps lightning fast.\n\n## Key Optimization Strategies\n\n### 1. Code Splitting\n\nImplement dynamic imports to reduce initial bundle size:\n\n\`\`\`javascript\nconst HeavyComponent = lazy(() => import('./HeavyComponent'))\n\nfunction App() {\n  return (\n    <Suspense fallback={<Loading />}>\n      <HeavyComponent />\n    </Suspense>\n  )\n}\n\`\`\`\n\n### 2. Memoization\n\nUse React.memo and useMemo strategically:\n\n\`\`\`javascript\nconst ExpensiveComponent = memo(({ data }) => {\n  const processedData = useMemo(() => \n    heavyProcessing(data), [data]\n  )\n  \n  return <div>{processedData}</div>\n})\n\`\`\`\n\n### 3. Virtual Scrolling\n\nHandle large lists efficiently:\n\n\`\`\`javascript\nimport { FixedSizeList } from 'react-window'\n\nfunction VirtualList({ items }) {\n  return (\n    <FixedSizeList\n      height={600}\n      itemCount={items.length}\n      itemSize={50}\n    >\n      {Row}\n    </FixedSizeList>\n  )\n}\n\`\`\`\n\n## Performance Monitoring\n\n1. Use React DevTools Profiler\n2. Implement performance budgets\n3. Monitor Core Web Vitals\n4. Set up continuous performance testing\n\n## Conclusion\n\nOptimizing React performance is an ongoing process. Start with measurements, identify bottlenecks, and apply these techniques strategically for maximum impact.`,
      date: '2024-01-05',
      author: 'Alex Chen',
      category: 'React',
      tags: ['React', 'Performance', 'Optimization', 'JavaScript', 'Web Development'],
      image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=1200&h=600&fit=crop',
      readTime: '10 min read',
    },
  ]

  return samplePosts
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find(post => post.slug === slug) || null
}