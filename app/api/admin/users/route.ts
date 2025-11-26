import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  createRateLimiter,
  validateApiRequest,
  logUnauthorizedAccess,
  getClientIp,
  getSecureHeaders,
} from '@/lib/security';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/admin/users
 * List all users (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Validate API request
    const validation = await validateApiRequest(request, {
      allowedMethods: ['GET'],
      validateOrigin: true,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 403, headers: getSecureHeaders() }
      );
    }

    // Apply rate limiting
    const rateLimiter = createRateLimiter('admin');
    const rateLimitResult = await rateLimiter(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const ip = getClientIp(request);
    const { userId } = await auth();
    
    if (!userId) {
      logUnauthorizedAccess(ip, '/api/admin/users');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecureHeaders() }
      );
    }

    // Verify user is admin
    const user = await clerkClient().users.getUser(userId);
    const role = (user.publicMetadata?.role as string) || 'viewer';
    
    if (role !== 'admin') {
      logUnauthorizedAccess(ip, '/api/admin/users', userId);
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403, headers: getSecureHeaders() }
      );
    }

    // Get all users from Clerk
    const users = await clerkClient().users.getUserList({
      limit: 100, // Adjust as needed
    });

    // Format user data
    const formattedUsers = users.data.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddresses: user.emailAddresses.map(email => email.emailAddress),
      imageUrl: user.imageUrl,
      role: (user.publicMetadata?.role as string) || 'viewer',
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
    }));

    return NextResponse.json({
      users: formattedUsers,
      count: formattedUsers.length,
      total: users.totalCount,
    }, { headers: getSecureHeaders() });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    );
  }
}

/**
 * PATCH /api/admin/users
 * Update user role or delete user (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    // Validate API request
    const validation = await validateApiRequest(request, {
      allowedMethods: ['PATCH'],
      requireContentType: true,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 403, headers: getSecureHeaders() }
      );
    }

    // Apply rate limiting
    const rateLimiter = createRateLimiter('admin');
    const rateLimitResult = await rateLimiter(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    const ip = getClientIp(request);
    const { userId } = await auth();
    
    if (!userId) {
      logUnauthorizedAccess(ip, '/api/admin/users');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: getSecureHeaders() }
      );
    }

    // Verify user is admin
    const currentUser = await clerkClient().users.getUser(userId);
    const role = (currentUser.publicMetadata?.role as string) || 'viewer';
    
    if (role !== 'admin') {
      logUnauthorizedAccess(ip, '/api/admin/users', userId);
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403, headers: getSecureHeaders() }
      );
    }

    const body = await request.json();
    const { targetUserId, action, newRole } = body;

    if (!targetUserId || !action) {
      return NextResponse.json(
        { error: 'targetUserId and action are required' },
        { status: 400, headers: getSecureHeaders() }
      );
    }

    // Prevent admin from modifying themselves
    if (targetUserId === userId && action === 'delete') {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400, headers: getSecureHeaders() }
      );
    }

    if (action === 'updateRole') {
      if (!newRole || !['admin', 'viewer'].includes(newRole)) {
        return NextResponse.json(
          { error: 'Invalid role. Must be "admin" or "viewer"' },
          { status: 400, headers: getSecureHeaders() }
        );
      }

      await clerkClient().users.updateUser(targetUserId, {
        publicMetadata: {
          role: newRole,
        },
      });

      return NextResponse.json({
        message: 'User role updated successfully',
        userId: targetUserId,
        newRole: newRole,
      }, { headers: getSecureHeaders() });
    }

    if (action === 'delete') {
      await clerkClient().users.deleteUser(targetUserId);
      
      return NextResponse.json({
        message: 'User deleted successfully',
        userId: targetUserId,
      }, { headers: getSecureHeaders() });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400, headers: getSecureHeaders() }
    );

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecureHeaders() }
    );
  }
}

