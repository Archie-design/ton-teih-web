import { NextResponse } from 'next/server';
import { SCRIPT_URL } from '@/lib/constants';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            // allow following redirects
            redirect: 'follow',
        });

        if (!response.ok) {
            throw new Error(`Google Apps Script responded with status: ${response.status}`);
        }

        return NextResponse.json({ success: true, message: '提交成功' });
    } catch (error) {
        console.error('API /api/submit error:', error);
        return NextResponse.json(
            { success: false, message: '發送失敗，請稍後再試。' },
            { status: 500 }
        );
    }
}
