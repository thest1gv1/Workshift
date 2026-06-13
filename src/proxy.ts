import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
	const auth = req.cookies.get('auth')
	console.log('proxy called:', req.nextUrl.pathname)

	if (!auth) {
		return NextResponse.redirect(new URL('/workshift/login', req.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!login|api|_next/static|_next/image|icons|manifest.webmanifest).*)'],
}
