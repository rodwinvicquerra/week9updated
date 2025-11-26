/**
 * Populates demo authentication logs for testing
 * This script adds sample logs to demonstrate the auth logging functionality
 */

async function populateDemoLogs() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const demoLogs = [
    {
      type: 'sign_in',
      userId: 'user_demo123',
      email: 'demo@example.com',
      userName: 'Demo User',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      type: 'sign_out',
      userId: 'user_demo123',
      email: 'demo@example.com',
      userName: 'Demo User',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      type: 'sign_up',
      userId: 'user_demo456',
      email: 'newuser@example.com',
      userName: 'New User',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
    },
    {
      type: 'session_created',
      userId: 'user_demo789',
      email: 'admin@example.com',
      userName: 'Admin User',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
    },
    {
      type: 'failed_auth',
      userId: 'unknown',
      email: 'hacker@suspicious.com',
      userName: 'Unknown',
      ipAddress: '203.0.113.42',
      userAgent: 'curl/7.68.0'
    }
  ];

  console.log('🔐 Populating demo authentication logs...\n');

  for (const log of demoLogs) {
    try {
      const response = await fetch(`${baseUrl}/api/auth/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(log)
      });

      if (response.ok) {
        console.log(`✅ Added ${log.type} event for ${log.userName}`);
      } else {
        console.log(`❌ Failed to add ${log.type} event: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error adding ${log.type} event:`, error.message);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n✨ Demo logs populated successfully!');
  console.log('Visit /admin/logs to view them (admin role required)');
}

populateDemoLogs().catch(console.error);
