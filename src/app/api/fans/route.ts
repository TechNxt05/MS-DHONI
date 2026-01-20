import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import FanMessage from '@/models/FanMessage';

export async function GET() {
    try {
        await dbConnect();
        const messages = await FanMessage.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: messages }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const message = await FanMessage.create(body);
        return NextResponse.json({ success: true, data: message }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to post message' }, { status: 400 });
    }
}
