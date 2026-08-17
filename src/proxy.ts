import { NextRequest, NextResponse } from "next/server";

//* List of known bad actors and vulnerability scanners — specific signatures only.
const BLOCKED_USER_AGENTS = [
   'l9scan',
   'LeakIX',
   'HUNT-Bot',
]

function isBlockedUserAgent(userAgent: string): boolean {
   const lowerUserAgent = userAgent.toLowerCase()
   return BLOCKED_USER_AGENTS.some((bot) => lowerUserAgent.includes(bot.toLowerCase()))
}

function getClientIp(request: NextRequest): string {
   return (
      request.headers.get('x-forwarded-for') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown'
   )
}

export function proxy(request: NextRequest) {
   const userAgent = request.headers.get('user-agent') || ''

   //? 1. Check for known malicious User-Agents
   if (isBlockedUserAgent(userAgent)) {
      //? Return a 403 Forbidden without processing the request further
      return new NextResponse(null, { status: 403 })
   }

   //? 2. Prevent direct access to API routes (if applicable)
   //? Require an origin header for API requests to stop simple script-kiddie CURLs.
   //? Exempt /api/autonoma: it's a server-to-server endpoint (the Autonoma test
   //? runner, never a browser) and already authenticates every request via HMAC
   //? signature — an Origin header wouldn't add anything there.
   if (
      request.nextUrl.pathname.startsWith('/api/') &&
      !request.nextUrl.pathname.startsWith('/api/autonoma') &&
      !request.headers.get('origin')
   ) {
      return new NextResponse('Unauthorized', { status: 401 })
   }

   //? Set X-Real-IP for logging
   const response = NextResponse.next()
   response.headers.set('X-Real-IP', getClientIp(request))
   return response
}

//? Only run middleware on specific paths to optimize performance
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