"use client"

import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail, Briefcase, Heart, Code2 } from "lucide-react"
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations"

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn direction="up" className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Heart className="h-4 w-4" />
            Get to know me
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A passionate developer on a journey to create impactful digital experiences
          </p>
        </FadeIn>
        
        {/* Quick Info Cards */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StaggerItem>
            <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-2 hover:border-primary/30 group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-sm text-muted-foreground">Roxas, Isabela</p>
                </div>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-2 hover:border-primary/30 group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors duration-200">
                  <Phone className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contact</h3>
                  <p className="text-sm text-muted-foreground">+63 916 582 9185</p>
                </div>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-2 hover:border-primary/30 group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Status</h3>
                  <p className="text-sm text-muted-foreground">Student Developer</p>
                </div>
              </div>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-2 hover:border-primary/30 group">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors duration-200">
                  <Code2 className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Focus</h3>
                  <p className="text-sm text-muted-foreground">Full Stack Dev</p>
                </div>
              </div>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          <FadeIn direction="left" delay={0.2}>
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
                My Story
              </h3>
              <div className="space-y-4 text-foreground/90 leading-relaxed">
              <p>
                I'm a 3rd year IT student majoring in <span className="font-semibold text-primary">Web Development</span> at 
                St. Paul University Philippines. My journey in tech is driven by a passion for creating modern, 
                responsive, and user-friendly web applications that solve real-world problems.
              </p>
              <p>
                Throughout my academic journey, I've been developing my skills in both front-end and back-end 
                technologies, focusing on building clean, efficient, and scalable web solutions. I enjoy learning 
                new frameworks and staying up-to-date with the latest web development trends.
              </p>
            </div>
          </Card>
          </FadeIn>

          <FadeIn direction="right" delay={0.3}>
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/30">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <div className="h-8 w-1 bg-gradient-to-b from-accent to-primary rounded-full" />
                What I'm Up To
              </h3>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">📚 Currently Learning</h4>
                <p className="text-sm text-foreground/80">
                  Mastering <span className="font-semibold">Laravel</span>, <span className="font-semibold">React</span>, and{" "}
                  <span className="font-semibold">Node.js</span> to build full-stack applications
                </p>
              </div>

              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <h4 className="font-semibold text-accent mb-2">💼 Side Projects</h4>
                <p className="text-sm text-foreground/80">
                  Working on <span className="font-semibold">Hotel Crew</span> - a hotel management and 
                  crew coordination system
                </p>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">🍖 Family Business</h4>
                <p className="text-sm text-foreground/80">
                  Helping with operations at <span className="font-semibold">Lita's Lechon</span>
                </p>
              </div>
            </div>
          </Card>
          </FadeIn>
        </div>

        {/* Goals */}
        <FadeIn direction="up" delay={0.4}>
          <Card className="mt-8 p-8 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
            <h3 className="text-2xl font-bold mb-4 text-center">Looking Ahead</h3>
            <p className="text-center text-foreground/90 max-w-3xl mx-auto leading-relaxed">
              I'm eager to apply my knowledge in real-world projects and continue growing as a developer. 
              I'm always open to new opportunities, collaborations, and learning experiences that will 
              help me become a better developer and make a positive impact in the tech community.
            </p>
          </Card>
        </FadeIn>
      </div>
    </section>
  )
}
