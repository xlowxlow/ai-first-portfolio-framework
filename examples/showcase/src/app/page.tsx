'use client'

import { Hero } from '@/components/sections/hero'
import { About } from '@/components/sections/about'
import { Projects } from '@/components/sections/projects'
import { Skills } from '@/components/sections/skills'
import { Blog } from '@/components/sections/blog'
import { Contact } from '@/components/sections/contact'
import { AIShowcase } from '@/components/sections/ai-showcase'

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <AIShowcase />
      <Blog />
      <Contact />
    </div>
  )
}