"use client"

import { useEffect } from "react"
import { useAuth, useUser } from "@clerk/nextjs"

/**
 * Client-side auth event tracker
 * Logs sign-in/sign-out events via API
 */
export function AuthEventTracker() {
  const { isSignedIn, userId } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    // Track sign-in event
    if (isSignedIn && userId && user) {
      const logSignInEvent = async () => {
        try {
          console.log('[AuthEventTracker] Logging sign-in event for:', user.primaryEmailAddress?.emailAddress)
          const response = await fetch('/api/auth/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'sign_in',
              userId: userId,
              email: user.primaryEmailAddress?.emailAddress || null,
              userName: user.fullName || null,
            }),
          })
          console.log('[AuthEventTracker] Sign-in logged:', response.ok)
        } catch (error) {
          console.error('Failed to log sign-in event:', error)
        }
      }

      logSignInEvent()

      // Track sign-out on component unmount or page unload
      const logSignOutEvent = async () => {
        try {
          console.log('[AuthEventTracker] Logging sign-out event')
          await fetch('/api/auth/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'sign_out',
              userId: userId,
              email: user.primaryEmailAddress?.emailAddress || null,
              userName: user.fullName || null,
            }),
          })
        } catch (error) {
          console.error('Failed to log sign-out event:', error)
        }
      }

      // Note: This tracks when page is closed, not actual sign-out
      // Actual sign-out is tracked via Clerk webhooks
      return () => {
        // Only log on actual sign out, not page refresh
        if (document.visibilityState === 'hidden') {
          logSignOutEvent()
        }
      }
    }
  }, [isSignedIn, userId, user])

  return null // This component doesn't render anything
}
