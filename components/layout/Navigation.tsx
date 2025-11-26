"use client"

import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/common"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { UserButton, useAuth, useUser } from "@clerk/nextjs"
import Link from "next/link"

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Goals", href: "#goals" },
  { name: "Education", href: "#education" },
  { name: "Projects", href: "#projects" },
  { name: "Documentation", href: "/documentation", isExternal: true },
  { name: "Security", href: "/security", isExternal: true, adminOnly: true },
  { name: "Contact", href: "#contact" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const { isSignedIn } = useAuth()
  const { user } = useUser()

  // Check if user has admin role (case-insensitive)
  const publicMetadata = user?.publicMetadata as { role?: string } | undefined
  const role = publicMetadata?.role?.toLowerCase() || ''
  const isAdmin = role === 'admin'

  // Filter nav items based on admin status
  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
      
      // Detect active section
      const sections = visibleNavItems
        .filter(item => !item.isExternal)
        .map(item => item.href.replace('#', ''))
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(`#${sectionId}`)
            break
          }
        }
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check on mount
    return () => window.removeEventListener("scroll", handleScroll)
  }, [visibleNavItems])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b transition-all duration-300 ${isScrolled ? "shadow-md border-border" : "border-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-xl font-bold text-primary hover:text-accent transition-colors tracking-tight">
              Rodwin's Portfolio
            </button>
            <div className="hidden md:flex items-center gap-1">
              {visibleNavItems.map((item) =>
                item.isExternal ? (
                  <a 
                    key={item.name} 
                    href={item.href}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 px-4 h-9 cursor-pointer relative group overflow-visible"
                  >
                    <span className="relative">
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-current group-hover:w-full transition-all duration-300 ease-out" />
                    </span>
                  </a>
                ) : (
                  <Button 
                    key={item.name} 
                    variant="ghost" 
                    onClick={() => scrollToSection(item.href)} 
                    className={`text-sm font-medium transition-all duration-200 px-4 relative group overflow-visible ${
                      activeSection === item.href
                        ? 'text-foreground bg-muted/70'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="relative">
                      {item.name}
                      {activeSection === item.href ? (
                        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-current" />
                      ) : (
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-current group-hover:w-full transition-all duration-300 ease-out" />
                      )}
                    </span>
                  </Button>
                )
              )}
              <div className="ml-4 flex items-center gap-3 pl-4 border-l border-border">
                <ThemeToggle />
                {isSignedIn && <UserButton afterSignOutUrl="/sign-in" />}
              </div>
            </div>
            <div className="flex md:hidden items-center gap-2">
              {isSignedIn && <UserButton afterSignOutUrl="/sign-in" />}
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="hover:bg-muted/50">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-card border-b border-border shadow-lg">
            <div className="px-4 py-6 space-y-1">
              {visibleNavItems.map((item) =>
                item.isExternal ? (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-start rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 px-4 py-2 cursor-pointer"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <Button key={item.name} variant="ghost" onClick={() => scrollToSection(item.href)} className="w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50">
                    {item.name}
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
