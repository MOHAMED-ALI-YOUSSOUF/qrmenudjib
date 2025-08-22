import { NextResponse } from 'next/server';
import { writeClient as sanityClient } from '@/sanity/lib/write-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // Check for authenticated session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch restaurant data for the authenticated user
    const query = `*[_type == "restaurant" && owner->email == $email][0] {
      _id,
      name,
      description,
      whatsapp,
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      instagram,
      facebook,
      tiktok,
      adresse,
      logo,
      coverImage,
      status,
      createdAt
    }`;
    const restaurant = await sanityClient.fetch(query, { email: session.user.email });

    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json({ error: 'Failed to fetch restaurant data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Check for authenticated session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const field = formData.get('field') as string;

    if (!file || !['coverImage', 'logo'].includes(field)) {
      return NextResponse.json({ error: 'Invalid file or field' }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Upload image to Sanity
    const asset = await sanityClient.assets.upload('image', file, {
      filename: file.name,
    });

    return NextResponse.json({
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Check for authenticated session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const data = await request.json();
    const {
      name,
      description,
      whatsapp,
      adresse,
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      instagram,
      facebook,
      tiktok,
      logo,
      coverImage,
    } = data;

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: 'Restaurant name is required' }, { status: 400 });
    }
    if (whatsapp && !/^\+?[1-9]\d{1,14}$/.test(whatsapp)) {
      return NextResponse.json({ error: 'Invalid WhatsApp number' }, { status: 400 });
    }

    // Fetch restaurant ID for the authenticated user
    const restaurantId = await sanityClient.fetch(
      `*[_type == "restaurant" && owner->email == $email][0]._id`,
      { email: session.user.email }
    );

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }

    // Prepare update data, converting null to undefined for image fields
    const updateData = {
      name,
      description,
      whatsapp,
      adresse,
      primaryColor,
      secondaryColor,
      accentColor,
      fontFamily,
      instagram,
      facebook,
      tiktok,
      logo: logo === null ? undefined : logo,
      coverImage: coverImage === null ? undefined : coverImage,
    };

    // Update restaurant in Sanity
    const updatedRestaurant = await sanityClient
      .patch(restaurantId)
      .set(updateData)
      .commit();

    return NextResponse.json(updatedRestaurant);
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return NextResponse.json({ error: 'Failed to update restaurant data' }, { status: 500 });
  }
}