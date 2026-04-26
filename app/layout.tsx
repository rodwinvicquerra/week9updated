import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { ChatButton } from "@/components/chat/ChatButton"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Rodwin's Portfolio",
  description: "Portfolio of Rodwin Vicquerra - 3rd Year IT Student majoring in Web Development",
  generator: "v0.app",
  icons: {
    icon: "/profilebnw.png",
    shortcut: "/profilebnw.png",
    apple: "/profilebnw.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </Suspense>
        <Toaster />
        <ChatButton />
        <Analytics />
      </body>
    </html>
  )
}
