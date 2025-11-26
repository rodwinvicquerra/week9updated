"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Github, Phone, MapPin, Check, Copy, Send, MessageCircle } from "lucide-react"
import { toast } from "sonner"

const contactLinks = [
  {
    name: "Email",
    value: "rodwindizvicquerra@gmail.com",
    href: "mailto:rodwindizvicquerra@gmail.com",
    icon: Mail,
    color: "from-primary to-accent",
  },
  {
    name: "Phone",
    value: "+63 916 582 9185",
    href: "tel:+639165829185",
    icon: Phone,
    color: "from-accent to-primary",
  },
  {
    name: "Location",
    value: "San Rafael, Roxas, Isabela 3320",
    href: "#",
    icon: MapPin,
    color: "from-primary/80 to-accent/80",
  },
  {
    name: "GitHub",
    value: "github.com/rudWin",
    href: "https://github.com/rudWin",
    icon: Github,
    color: "from-accent/80 to-primary/80",
  },
]

export function ContactSection() {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(label)
      toast.success(`${label} copied to clipboard!`)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (err) {
      toast.error("Failed to copy to clipboard")
    }
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-sm font-medium text-accent mb-4">
            <MessageCircle className="h-4 w-4" />
            Let's Connect
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I'm always open to discussing new projects, collaborations, or opportunities. 
            Feel free to reach out through any of the channels below.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {contactLinks.map((link) => {
            const isCopyable = link.name === "Email" || link.name === "Phone"
            const isCopied = copiedItem === link.name
            const Icon = link.icon
            
            return (
              <Card
                key={link.name}
                className="group p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/50 relative overflow-hidden"
                onClick={() => {
                  if (isCopyable) {
                    const textToCopy = link.name === "Email" 
                      ? "rodwindizvicquerra@gmail.com" 
                      : "+639165829185"
                    copyToClipboard(textToCopy, link.name)
                  } else if (link.href !== "#") {
                    window.open(link.href, link.href.startsWith('http') ? '_blank' : '_self')
                  }
                }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Success overlay */}
                {isCopied && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-sm animate-fade-in">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Check className="h-5 w-5" />
                      Copied!
                    </div>
                  </div>
                )}
                
                {/* Content */}
                <div className="relative flex items-center gap-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${link.color} opacity-10 group-hover:opacity-20 transition-all relative`}>
                    <Icon className="h-7 w-7 text-primary" />
                    {isCopyable && (
                      <div className="absolute -top-2 -right-2 bg-accent rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Copy className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {link.name}
                      </h3>
                      {isCopyable && (
                        <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to copy
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{link.value}</p>
                  </div>
                </div>

                {/* Corner decoration */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${link.color} opacity-5 rounded-bl-full`} />
              </Card>
            )
          })}
        </div>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 transition-all text-lg px-8" 
            asChild
          >
            <a href="mailto:rodwindizvicquerra@gmail.com">
              <Send className="h-5 w-5" />
              Send Email
            </a>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-2 border-2 hover:bg-accent/10 hover:border-accent hover:text-accent transition-all text-lg px-8" 
            asChild
          >
            <a href="tel:+639165829185">
              <Phone className="h-5 w-5" />
              Call Me
            </a>
          </Button>
        </div>

        {/* Footer note */}
        <Card className="mt-12 p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-semibold">Pro tip:</span> Click on email or phone to copy them to your clipboard!
          </p>
        </Card>
      </div>
    </section>
  )
}
