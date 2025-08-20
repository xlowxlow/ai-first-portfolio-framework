'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Brain, Sparkles, Zap, Shield, TrendingUp, Bot } from 'lucide-react'

const aiFeatures = [
  {
    icon: Brain,
    title: 'Smart Content Generation',
    description: 'AI-powered content that adapts to your audience and SEO requirements.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Sparkles,
    title: 'Automated Optimization',
    description: 'Continuous performance improvements through machine learning.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Instant Personalization',
    description: 'Dynamic content that adjusts to user preferences in real-time.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'AI Security',
    description: 'Advanced threat detection and prevention using AI algorithms.',
    color: 'from-green-500 to-teal-500',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Analytics',
    description: 'Data-driven insights to forecast trends and user behavior.',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Bot,
    title: 'Intelligent Automation',
    description: 'Streamlined workflows with AI-powered task automation.',
    color: 'from-indigo-500 to-purple-500',
  },
]

const metrics = [
  { label: 'Performance Score', value: '98/100', improvement: '+15%' },
  { label: 'SEO Optimization', value: '100%', improvement: '+40%' },
  { label: 'Load Time', value: '0.8s', improvement: '-60%' },
  { label: 'User Engagement', value: '85%', improvement: '+25%' },
]

export function AIShowcase() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <section id="ai-showcase" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <h2 className="text-4xl font-bold">AI-Powered Features</h2>
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the future of web development with intelligent optimization and automation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300" />
              
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-8 text-center">AI Optimization Results</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                <div className="text-sm opacity-90 mb-1">{metric.label}</div>
                <div className="text-green-300 font-semibold">{metric.improvement}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Want to see the AI features in action?
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            Try AI Demo
          </button>
        </motion.div>
      </div>
    </section>
  )
}