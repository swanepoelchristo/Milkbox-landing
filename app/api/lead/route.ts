// app/api/lead/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Small helper so we never “forget” an env
function reqEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
    // 1) Parse JSON from the form
    const data = await req.json().catch(() => ({} as any));
    const {
      name = '',
      email = '',
      age = '',
      region = '',
      job = '',
      hobbies = '',
      dob = '',
      goals = '',
      referral = '',
    } = data || {};

    // 2) Basic validation (keep it light)
    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: 'Name and Email are required' },
        { status: 400 }
      );
    }

    // 3) Build email text (simple but readable)
    const text = `
New lead from MilkBox AI

Name: ${name}
Email: ${email}
Age: ${age}
Region: ${region}
Job/Role: ${job}
Hobbies: ${hobbies}
Date of Birth: ${dob}
Goals (12 months): ${goals}
Referral: ${referral}
`.trim();

    // 4) SMTP transport (works for 465 SSL or 587 TLS)
    const host = reqEnv('SMTP_HOST');
    const port = Number(reqEnv('SMTP_PORT')); // 465 or 587
    const user = reqEnv('SMTP_USER');
    const pass = reqEnv('SMTP_PASS');
    const from = reqEnv('MAIL_FROM'); // e.g. 'MilkBox AI <admin@yourdomain.com>'
    const to = reqEnv('MAIL_TO');     // where you want to receive leads

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465 (SSL), false for 587 (TLS)
      auth: { user, pass },
      // Optional timeouts are nice for serverless
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
    });

    // 5) Send
    const info = await transporter.sendMail({
      from,
      to,
      subject: `New MilkBox AI Lead: ${name}`,
      text,
    });

    // 6) Return success (don’t leak internal details)
    return NextResponse.json({ ok: true, id: info.messageId });
  } catch (err: any) {
    // Log enough to debug in Vercel logs
    console.error('Lead API error:', err?.message || err);
    return NextResponse.json(
      { ok: false, error: 'Failed to send lead email' },
      { status: 500 }
    );
  }
}
