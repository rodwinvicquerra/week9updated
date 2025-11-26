"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Award } from "lucide-react"
import Image from "next/image"

const education = [
  {
    degree: "Bachelor of Science in Information Technology",
    institution: "St. Paul University Philippines",
    period: "2022 - Present",
    description:
      "Major in Web Development. Currently in 3rd year, focusing on full-stack web development, database management, and software engineering principles.",
    achievements: ["Web Development Major", "Active Learner", "Project Portfolio"],
  },
]

const certifications = [
  { name: "CyberSummit 2022", issuer: "St. Paul University Philippines", year: "2022", type: "Participation" },
  { name: "CyberSummit 2023", issuer: "St. Paul University Philippines", year: "2023", type: "Participation" },
  { name: "CyberSummit 2024", issuer: "St. Paul University Philippines", year: "2024", type: "Participation" },
  { name: "HackTheNorth Seminar 2025", issuer: "St. Paul University Philippines", year: "2025", type: "Participation" },
  { name: "Rich Media Film Showing", issuer: "St. Paul University Philippines", year: "2024", type: "1st Runner Up" },
]

export function EducationSection() {
  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">Education & Certifications</h2>

        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Education</h3>
          <Card className="p-6 hover:shadow-lg transition-shadow max-w-3xl">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold mb-1">{education[0].degree}</h4>
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                  <Image src="/saintpaullogo.png" alt="St. Paul University" width={20} height={20} className="rounded" />
                  <span>{education[0].institution} • {education[0].period}</span>
                </div>
                <p className="text-sm mb-4 text-foreground/80">{education[0].description}</p>
                <div className="flex flex-wrap gap-2">
                  {education[0].achievements.map((achievement) => (
                    <Badge key={achievement} variant="secondary" className="text-xs">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-foreground">Certifications & Achievements</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert, idx) => (
              <Card key={idx} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Award className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{cert.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">
                      {cert.issuer} • {cert.year}
                    </p>
                    {cert.type && (
                      <Badge variant="outline" className="text-xs">
                        {cert.type}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
