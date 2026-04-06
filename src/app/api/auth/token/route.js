import { auth } from '@clerk/nextjs/server';

export async function GET() {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return Response.json({ error: 'No token' }, { status: 401 });
    }

    return Response.json({ token });
  } catch (error) {
    console.error('Token error:', error);
    return Response.json({ error: 'Failed to get token' }, { status: 500 });
  }
}