import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'
  const isProtectedPage = request.nextUrl.pathname === '/' || 
                          request.nextUrl.pathname === '/expenses' || 
                          request.nextUrl.pathname === '/incomes' ||
                          request.nextUrl.pathname === '/monthly-stats'
  
  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/expenses', '/incomes', '/monthly-stats', '/login', '/register']
}