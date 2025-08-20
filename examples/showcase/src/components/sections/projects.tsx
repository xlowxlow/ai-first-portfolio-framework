'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Star } from 'lucide-react'
import Link from 'next/link'

const projects = [
  {
    id: 1,
    title: 'AI Content Generator',
    description: 'A powerful SaaS platform that leverages GPT-4 to generate high-quality content for blogs, social media, and marketing campaigns.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    tags: ['Next.js', 'OpenAI', 'Stripe', 'PostgreSQL'],
    github: 'https://github.com/alexchen/ai-content-gen',
    demo: 'https://ai-content-gen.vercel.app',
    stars: 342,
    featured: true,
  },
  {
    id: 2,
    title: 'E-Commerce Dashboard',
    description: 'Real-time analytics dashboard for e-commerce businesses with advanced data visualization and predictive insights.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    tags: ['React', 'D3.js', 'Node.js', 'MongoDB'],
    github: 'https://github.com/alexchen/ecommerce-dash',
    demo: 'https://ecommerce-dash.vercel.app',
    stars: 256,
    featured: true,
  },
  {
    id: 3,
    title: 'Task Management App',
    description: 'Collaborative task management platform with real-time updates, team chat, and AI-powered task prioritization.',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
    tags: ['Vue.js', 'Socket.io', 'Express', 'Redis'],
    github: 'https://github.com/alexchen/task-manager',
    demo: 'https://taskmanager.alexchen.dev',
    stars: 189,
    featured: false,
  },
  {
    id: 4,
    title: 'Code Review Assistant',
    description: 'AI-powered code review tool that provides intelligent suggestions and catches potential bugs before deployment.',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    tags: ['Python', 'FastAPI', 'LangChain', 'Docker'],
    github: 'https://github.com/alexchen/code-reviewer',
    demo: 'https://code-review.alexchen.dev',
    stars: 421,
    featured: true,
  },
  {
    id: 5,
    title: 'Portfolio Framework',
    description: 'Open-source framework for building AI-optimized portfolio websites with built-in SEO and performance features.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
    tags: ['Astro', 'React', 'Tailwind', 'TypeScript'],
    github: 'https://github.com/alexchen/ai-portfolio',
    demo: 'https://portfolio-framework.dev',
    stars: 567,
    featured: true,
  },
]

export function Projects() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section id="projects" className="py-20 bg-white dark:bg-gray-900" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A selection of my recent work and open-source contributions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                project.featured ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">Code</span>
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-sm">Demo</span>
                    </a>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">{project.stars}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            <span>View All Projects</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}