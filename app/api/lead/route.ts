export const runtime = "nodejs";

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    if (!payload?.email || !payload?.name) {
      return NextResponse.json({ ok: false, error: "Missing name or email" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const body = Object.entries(payload)
      .map(([k, v]) => `${k}: ${typeof v === "boolean" ? (v ? "true" : "false") : (v ?? "")}`)
      .join("\n");

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `MilkBox InfoGate — ${payload.name}`,
      text: body
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
