import { NextResponse } from 'next/server';
import { getArchive } from '@/lib/data';

export async function GET(
  request: Request,
  context: { params: { archiveId: string } }
) {
  const params = await context.params;
  const archiveId = params.archiveId;
  console.log('API route called with archiveId:', archiveId);

  try {
    const archive = await getArchive(archiveId);
    console.log('Retrieved archive:', archive);
    if (!archive) {
      return new NextResponse('Archive not found', { status: 404 });
    }
    return NextResponse.json(archive);
  } catch (error) {
    console.error('Error fetching archive:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}