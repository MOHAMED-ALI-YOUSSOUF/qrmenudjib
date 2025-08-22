// @/lib/restaurant/getRestaurants.ts

import { defineQuery } from 'next-sanity';
import { sanityFetch } from '../live';
import { Restaurant } from '../types';

export const getRestaurantsBySlug = async (slug: string): Promise<Restaurant[]> => {
  const RESTAURANTS_QUERY = defineQuery(`
    *[_type == "restaurant" && slug.current == $slug][0] | order(name asc) {
      _id,
        name,
        slug,
        description,
        logo,
        coverImage,
        whatsapp,
        primaryColor,
        secondaryColor,
        accentColor,
        fontFamily,
        instagram,
        facebook,
        tiktok,
        adresse,
        status,
        pendingReason,
        createdAt,
        owner->{
          _id,
          name,
          email,
          whatsapp,
          status
        }
    }
  `);

  try {
    const restaurants = await sanityFetch({ 
      query: RESTAURANTS_QUERY,
      params: { userId },
    });
    console.log('Fetched Restaurants:', restaurants.data);
    return restaurants.data || [];
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
};