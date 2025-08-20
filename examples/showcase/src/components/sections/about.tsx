'use client'

import { motion } from 'framer-motion'
import { Code2, Cpu, Globe, Rocket } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

const features = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, scalable, and efficient code following best practices.',
  },
  {
    icon: Cpu,
    title: 'AI Integration',
    description: 'Leveraging cutting-edge AI technologies to build intelligent applications.',
  },
  {
    icon: Globe,
    title: 'Global Impact',
    description: 'Creating solutions that reach users worldwide and make a difference.',
  },
  {
    icon: Rocket,
    title: 'Performance',
    description: 'Optimizing for speed, efficiency, and exceptional user experience.',
  },
]

export function About() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Passionate developer with 8+ years of experience building innovative solutions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">Crafting Digital Excellence</h3>
            <p className="text-gray-600 dark:text-gray-400">
              I&apos;m a full-stack developer with a passion for creating elegant solutions to complex problems.
              With expertise in modern web technologies and AI integration, I build applications that are
              not just functional, but delightful to use.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              My journey in tech started with a curiosity about how things work, and has evolved into a
              career focused on pushing the boundaries of what&apos;s possible with code. I specialize in React,
              Next.js, Node.js, and cloud technologies, with a growing focus on AI and machine learning.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              When I&apos;m not coding, you&apos;ll find me contributing to open source projects, writing technical
              articles, or exploring the latest developments in AI and web technologies.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-lg opacity-20" />
            <img
              src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=800&h=600&fit=crop"
              alt="Coding workspace"
              className="relative rounded-lg shadow-xl"
            />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}