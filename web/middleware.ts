import { NextResponse, NextRequest } from 'next/server'
export function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value
  const url = req.nextUrl
  const protectedPaths = ['/ideas/new', '/me', '/store/cart']
  if (protectedPaths.some(p => url.pathname.startsWith(p)) && !token) {
    const login = new URL('/login', req.url); login.searchParams.set('returnTo', url.pathname + url.search)
    return NextResponse.redirect(login)
  }
  return NextResponse.next()
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
