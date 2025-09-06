import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({
      from: "QRMenu <no-reply@qrmenu.rohaty.com>",
      to,
      subject,
      html,
    });
    console.log("✅ Email envoyé à", to);
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);
  }
}
