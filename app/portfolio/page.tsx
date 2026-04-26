"use client"

import { Navigation, Footer } from "@/components/layout"
import { 
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  GoalsSection,
  EducationSection,
  ContactSection
} from "@/components/sections"

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <GoalsSection />
      <EducationSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}