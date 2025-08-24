import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // If the path already starts with /client, continue without redirect
  if (pathname.startsWith('/client')) {
    return NextResponse.next()
  }

  // Redirect to /client prefixed path
  return NextResponse.redirect(new URL(`/client${pathname}`, request.url))
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
}

