// app/api/clear-payment-status/route.js
import { NextResponse } from 'next/server';
import { resetPaymentStatus } from '../payment-status/route.js';

// Quand le front veut “vider” le statut après lecture
export async function POST() {
    globalThis.lastPaymentStatus = null;
    return NextResponse.json({ cleared: true });
}
