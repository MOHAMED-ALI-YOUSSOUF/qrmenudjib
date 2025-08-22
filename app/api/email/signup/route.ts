import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'QRMenu.dj <no-reply@qrmenu.dj>',
      to: email,
      subject: 'Bienvenue sur QRMenu.dj !',
      html: `
        <h1>Bienvenue, ${name} !</h1>
        <p>Votre compte a été créé avec succès. Commencez à gérer votre menu digital dès maintenant sur <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">votre tableau de bord</a>.</p>
      `,
    });

    return NextResponse.json({ message: 'Email sent' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}