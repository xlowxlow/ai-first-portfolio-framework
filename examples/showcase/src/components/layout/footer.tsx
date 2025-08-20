import Link from 'next/link'
import { Github, Linkedin, Twitter, Mail, Heart } from 'lucide-react'

const socialLinks = [
  { href: 'https://github.com/alexchen', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/alexchen', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://twitter.com/alexchen', icon: Twitter, label: 'Twitter' },
  { href: 'mailto:alex@alexchen.dev', icon: Mail, label: 'Email' },
]

const footerLinks = [
  {
    title: 'Navigation',
    links: [
      { href: '/about', label: 'About' },
      { href: '/projects', label: 'Projects' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/ai-insights', label: 'AI Insights' },
      { href: '/blog/tech-stack', label: 'Tech Stack' },
      { href: '/blog/learning-path', label: 'Learning Path' },
      { href: '/resume.pdf', label: 'Resume' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gradient mb-4">Alex Chen</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Full-Stack Developer & AI Engineer crafting innovative digital experiences
              with cutting-edge technologies.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t dark:border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Alex Chen. All rights reserved.
            </p>
            <p className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              Built with <Heart className="w-4 h-4 mx-1 text-red-500" /> using AI-First Portfolio Framework
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}