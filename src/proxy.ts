import { NextRequest, NextResponse } from 'next/server'

export function proxy(req: NextRequest) {
	const auth = req.cookies.get('auth')

	if (!auth) {
		return NextResponse.redirect(new URL('/login', req.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/',
		'/((?!login|api|_next/static|_next/image|icons|manifest.webmanifest).+)',
	],
}
