import nodemailer from "nodemailer";
import { s, sBool, sList, type SettingsMap } from "./settings";

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
}

/** Reads the SMTP server config saved under Site Settings → Email & SMTP. */
function readSmtpConfig(settings: SettingsMap): SmtpConfig | null {
  const host = s(settings, "smtp_host");
  const fromEmail = s(settings, "smtp_from_email");
  if (!host || !fromEmail) return null;

  return {
    host,
    port: Number(s(settings, "smtp_port")) || 587,
    secure: sBool(settings, "smtp_secure", false),
    user: s(settings, "smtp_username"),
    pass: s(settings, "smtp_password"),
    fromName: s(settings, "smtp_from_name") || s(settings, "site_name"),
    fromEmail,
  };
}

/**
 * Sends an email using the SMTP server configured in Site Settings.
 * Returns quietly (does nothing) when SMTP hasn't been configured yet, so
 * public form submissions never fail just because email isn't set up.
 */
export async function sendMail(
  settings: SettingsMap,
  opts: {
    to: string;
    cc?: string[];
    replyTo?: string;
    subject: string;
    html: string;
    text?: string;
  }
): Promise<{ sent: boolean; error?: string }> {
  const config = readSmtpConfig(settings);
  if (!config || !opts.to) return { sent: false, error: "SMTP is not configured." };

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.user ? { user: config.user, pass: config.pass } : undefined,
    });

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: opts.to,
      cc: opts.cc && opts.cc.length > 0 ? opts.cc.join(", ") : undefined,
      replyTo: opts.replyTo,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    return { sent: true };
  } catch (error) {
    console.error("sendMail failed:", error);
    return { sent: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/** CC addresses configured for contact form notifications, one per line. */
export function contactCcList(settings: SettingsMap): string[] {
  return sList(settings, "contact_cc_emails");
}

/** Where contact form notifications go: the dedicated field, or the general contact email. */
export function contactToEmail(settings: SettingsMap): string {
  return s(settings, "contact_to_email") || s(settings, "email");
}
