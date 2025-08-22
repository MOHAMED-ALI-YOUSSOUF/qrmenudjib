import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUserAndRestaurant } from '@/sanity/lib/user/createUser';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Hash le mot de passe côté serveur
    const hashedPassword = await bcrypt.hash(password, 10);

    const { userId, restaurantId } = await createUserAndRestaurant({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ userId, restaurantId }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
