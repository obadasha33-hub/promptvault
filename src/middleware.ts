import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Match specific routes that require user authentication
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/profile(.*)',
  '/api/prompts/publish(.*)',
  '/api/prompts/delete(.*)',
  '/api/prompts/save(.*)',
]);

// Initialize Upstash Redis and Ratelimiter safely if environment variables are present
let redis: Redis | null = null;
let ratelimit: Ratelimit | null = null;

try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.tokenBucket(60, '1 m', 60), // Token Bucket strategy: 60 requests per minute
      analytics: true,
      prefix: '@upstash/ratelimit',
    });
  } else {
    console.warn('Upstash Redis environment variables are missing. Rate limiting is disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Upstash Redis:', error);
}

// Helper to extract client IP address safely
const getClientIp = (req: NextRequest) => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0].trim();
    if (ip) return ip;
  }
  return (req as unknown as { ip?: string }).ip || '127.0.0.1';
};

export default clerkMiddleware(async (auth, req) => {
  // Rate-limiting check for /api/prompts
  if (req.nextUrl.pathname.startsWith('/api/prompts')) {
    const { userId } = await auth();
    const identifier = userId || getClientIp(req);

    if (ratelimit) {
      try {
        const { success, reset } = await ratelimit.limit(identifier);
        if (!success) {
          const retryAfter = Math.ceil((reset - Date.now()) / 1000);
          return NextResponse.json(
            { error: 'Too Many Requests' },
            {
              status: 429,
              headers: {
                'Retry-After': String(retryAfter),
              },
            }
          );
        }
      } catch (error) {
        console.error('Upstash Rate Limiting execution error:', error);
        // Fail-open to prevent breaking functionality if Upstash is down
      }
    }
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Match all routes except static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API/Server Actions
    '/(api|trpc)(.*)',
  ],
};
