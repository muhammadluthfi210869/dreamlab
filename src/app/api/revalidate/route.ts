import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

export async function POST(request: NextRequest) {
  if (!REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: 'REVALIDATION_SECRET not configured on server' },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (token !== REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: 'Invalid or missing revalidation token' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const paths: string[] = body.paths || [];
    const tags: string[] = body.tags || [];
    const type = body.type || 'path';

    const revalidated: string[] = [];
    const failed: string[] = [];

    if (type === 'tag' || tags.length > 0) {
      for (const tag of tags) {
        try {
          revalidateTag(tag, 'default');
          revalidated.push(`tag:${tag}`);
        } catch {
          failed.push(`tag:${tag}`);
        }
      }
    }

    if (type === 'path' || paths.length > 0) {
      for (const path of paths) {
        try {
          revalidatePath(path);
          revalidated.push(`path:${path}`);
        } catch {
          failed.push(`path:${path}`);
        }
      }
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      revalidatedPaths: revalidated,
      failedPaths: failed.length > 0 ? failed : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body. Send { paths: [], tags: [], type: "path"|"tag" }' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      status: 'revalidation endpoint active',
      usage: {
        method: 'POST',
        headers: { Authorization: 'Bearer <REVALIDATION_SECRET>' },
        body: {
          paths: ['/path-to-revalidate', '/another-path'],
          tags: ['products', 'maklon-pricing'],
          type: 'path',
        },
      },
      example: {
        curl: 'curl -X POST https://dreamlab.id/api/revalidate -H "Authorization: Bearer YOUR_SECRET" -H "Content-Type: application/json" -d \'{"paths":["/maklon-skincare/"],"tags":["products"],"type":"path"}\'',
      },
    },
    { status: 200 }
  );
}
