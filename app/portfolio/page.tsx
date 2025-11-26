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
import { useAuth, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PortfolioPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const { signOut } = useClerk()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in")
    }
  }, [isLoaded, isSignedIn, router])

  // Prevent back button navigation - auto logout on back
  useEffect(() => {
    const handlePopState = async () => {
      if (isSignedIn) {
        await signOut()
        router.replace("/sign-in")
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [isSignedIn, signOut, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  if (!isSignedIn) {
    return null
  }

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