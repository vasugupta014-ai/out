import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Get authentication status from cookies
    const accessToken = request.cookies.get('access_token')?.value;
    const isLoggedIn = request.cookies.get('is_logged_in')?.value === 'true';

    // Define public routes that don't require authentication
    const publicRoutes = [
        '/user/login',
        '/user/register',
        '/user/password-reset',
        '/user/password-reset-request',
        '/user/validate',
    ];

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route => 
        pathname === route || pathname.startsWith(route + '/')
    );

    // Check if the current path is under /user
    const isUserRoute = pathname.startsWith('/user');

    // If not logged in and trying to access protected user routes
    if (isUserRoute && !isPublicRoute && (!accessToken || !isLoggedIn)) {
        const loginUrl = new URL('/user/login', request.url);
        
        // Preserve the original path for redirect after login
        loginUrl.searchParams.set('redirect', pathname);
        
        return NextResponse.redirect(loginUrl);
    }

    // If logged in and trying to access public routes (login, register, etc.)
    if (isUserRoute && isPublicRoute && accessToken && isLoggedIn) {
        return NextResponse.redirect(new URL('/user/dashboard', request.url));
    }

    // Allow the request to continue
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/user/:path*', // This matches all /user/* routes
    ],
};