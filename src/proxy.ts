import { NextRequest, NextResponse } from "next/server";

//* List of known bad actors and vulnerability scanners — specific signatures only.
const BLOCKED_USER_AGENTS = [
   'l9scan',
   'LeakIX',
   'Go-http-client',
   'HUNT-Bot',
]

export function proxy(request: NextRequest) {
   const userAgent = request.headers.get('user-agent') || ''

   // 1. Check for known malicious User-Agents
   const isBlocked = BLOCKED_USER_AGENTS.some((bot) =>
      userAgent.toLowerCase().includes(bot.toLowerCase())
   )

   if (isBlocked) {
      // Return a 403 Forbidden without processing the request further
      return new NextResponse(null, { status: 403 })
   }

   // Rate limit (consider using Upstash Redis or similar)
   // Add X-Forwarded-For header validation
   const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("cf-connecting-ip") || 
               "unknown";

   // 2. Prevent direct access to API routes (if applicable)
   // Require an origin header for API requests to stop simple script-kiddie CURLs
   if (request.nextUrl.pathname.startsWith('/api/')) {
      const origin = request.headers.get('origin')
      // Note: Adjust this logic based on how your API is actually used
      if (!origin) {
         return new NextResponse('Unauthorized', { status: 401 })
      }
   }

   // Set X-Real-IP for logging
   const response = NextResponse.next();
   response.headers.set("X-Real-IP", ip);
   return response;
}

// Only run middleware on specific paths to optimize performance
export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!_next/static|_next/image|favicon.ico).*)',
   ],
}