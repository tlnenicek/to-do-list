import { createCookieSessionStorage } from '@remix-run/node';

const sessionSecret = process.env.SESSION_SECRET || 'fallback-secret-very-unsafe';
const storage = createCookieSessionStorage({
    cookie: {
        name: '_session',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets: [sessionSecret],
        maxAge: 60 * 60 * 24 * 30,
    },
});

export async function getSession(request: Request) {
    const session = await storage.getSession(request.headers.get('Cookie'));
    return session;
}

export async function commitSession(session: any) {
    return await storage.commitSession(session);
}

export async function destroySession(request: Request) {
    const session = await storage.getSession(request.headers.get('Cookie'));
    return await storage.destroySession(session);
}
