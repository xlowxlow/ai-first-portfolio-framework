'use client'

import { Brain, Sparkles, TrendingUp, Zap, Shield, Code2 } from 'lucide-react'
import { motion } from 'framer-motion'

const insights = [
  {
    title: 'Performance Metrics',
    description: 'Real-time analysis of your site performance with AI-powered recommendations',
    metrics: [
      { label: 'Page Speed', value: '98/100', trend: '+12%' },
      { label: 'SEO Score', value: '100/100', trend: '+25%' },
      { label: 'Accessibility', value: '95/100', trend: '+8%' },
      { label: 'Best Practices', value: '100/100', trend: '+15%' },
    ],
  },
  {
    title: 'Content Optimization',
    description: 'AI analyzes and optimizes your content for maximum engagement',
    features: [
      'Automated keyword optimization',
      'Readability score improvements',
      'Meta description generation',
      'Content structure analysis',
    ],
  },
  {
    title: 'User Behavior Analysis',
    description: 'Deep insights into how users interact with your portfolio',
    stats: [
      { label: 'Avg. Session Duration', value: '4m 32s' },
      { label: 'Bounce Rate', value: '12%' },
      { label: 'Pages per Session', value: '5.3' },
      { label: 'Conversion Rate', value: '8.5%' },
    ],
  },
]

const aiTools = [
  {
    icon: Brain,
    name: 'Smart Content Generator',
    description: 'Generate SEO-optimized content with GPT-4',
    status: 'active',
  },
  {
    icon: Sparkles,
    name: 'Auto Layout Optimizer',
    description: 'AI adjusts layouts based on user preferences',
    status: 'active',
  },
  {
    icon: Shield,
    name: 'Security Monitor',
    description: 'Real-time threat detection and prevention',
    status: 'active',
  },
  {
    icon: TrendingUp,
    name: 'Performance Predictor',
    description: 'Forecast site performance and user trends',
    status: 'beta',
  },
  {
    icon: Zap,
    name: 'Speed Optimizer',
    description: 'Automatic code and asset optimization',
    status: 'active',
  },
  {
    icon: Code2,
    name: 'Code Assistant',
    description: 'AI-powered code suggestions and fixes',
    status: 'active',
  },
]

export default function AIInsights() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4">
            AI <span className="text-gradient">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Discover how AI transforms your portfolio with intelligent optimization,
            real-time analytics, and automated improvements
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold mb-2">{insight.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {insight.description}
              </p>
              
              {insight.metrics && (
                <div className="space-y-3">
                  {insight.metrics.map((metric) => (
                    <div key={metric.label} className="flex justify-between items-center">
                      <span className="text-sm">{metric.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{metric.value}</span>
                        <span className="text-green-500 text-xs">{metric.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {insight.features && (
                <ul className="space-y-2">
                  {insight.features.map((feature) => (
                    <li key={feature} className="flex items-start space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-500 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {insight.stats && (
                <div className="grid grid-cols-2 gap-4">
                  {insight.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-16 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">AI-Powered Tools</h2>
          <p className="mb-8 opacity-90">
            Cutting-edge AI tools working behind the scenes to enhance your portfolio
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiTools.map((tool) => (
              <div
                key={tool.name}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <tool.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{tool.name}</h4>
                      {tool.status === 'beta' && (
                        <span className="text-xs px-2 py-1 bg-yellow-400/20 text-yellow-300 rounded-full">
                          Beta
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-80">{tool.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Experience the Future</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            This portfolio is continuously learning and improving. Every interaction helps
            the AI understand user preferences better, creating a more personalized experience.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            Get AI-Powered Portfolio
          </button>
        </motion.div>
      </div>
    </div>
  )
}