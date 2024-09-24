import { jwtDecode } from 'jwt-decode';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { IDecodedToken } from './type/authType';

export const middleware = (req: NextRequest) => {
    const res = NextResponse.next();
    const cookieToken = req.cookies.get('refreshToken');
    const cookieEventId = req.cookies.get('eventId');
    
    // menghapus eventId di cookie jika user sudah di path utama
  if(cookieEventId ) {
    if(req.nextUrl.pathname === '/create-event') {
        return NextResponse.redirect(new URL('/create-event/create-ticket', req.url));
    }
    if(req.nextUrl.pathname === '/') {
        res.cookies.set('eventId', '', { 
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 0, 
            path: '/'
          });
          return res
    }
  }

  if(!cookieEventId ) {
    if(
        req.nextUrl.pathname == '/create-event/create-ticket' || 
        req.nextUrl.pathname == '/create-event/create-ticket/success-create'
    ){
        return NextResponse.redirect(new URL('/create-event', req.url));
    }
  }

    if(!cookieToken ) {
        if(
            req.nextUrl.pathname.startsWith('/dashboard') ||
            req.nextUrl.pathname.startsWith('/profile') ||
            req.nextUrl.pathname.startsWith('/create-event')
            // req.nextUrl.pathname.startsWith('/transaction/:path*')
        ){
        return NextResponse.redirect(new URL('/', req.url));
        }
    }
    
    if(cookieToken) {
        if(
            req.nextUrl.pathname.startsWith('/login') ||
            req.nextUrl.pathname.startsWith('/register')
        ){
            return NextResponse.error()
        }
        const decoded: IDecodedToken = jwtDecode(cookieToken.value);
        const role = decoded.role;
        if(role !== 'seller' && req.nextUrl.pathname.startsWith('/dashboard')){
            return NextResponse.redirect(new URL('/', req.url));
        }
    }
}