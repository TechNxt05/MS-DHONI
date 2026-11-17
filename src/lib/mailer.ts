import nodemailer, { type Transporter } from 'nodemailer';

/** Gmail SMTP with an app password. Pooled, so a batch of sends reuses one connection. */
let cached: Transporter | null = null;

export function mailConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

export function mailer() {
  cached ??= nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    maxConnections: 2,
    auth: { user: process.env.GMAIL_USER!, pass: process.env.GMAIL_APP_PASSWORD! },
  });
  return cached;
}

export const sender = () => ({ name: 'Dhoni: On This Day', address: process.env.GMAIL_USER! });

export const EMAIL_RE = /^[^\s@,<>]+@[^\s@,<>]+\.[^\s@,<>]{2,}$/;

export function cleanEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && EMAIL_RE.test(email) ? email : null;
}
