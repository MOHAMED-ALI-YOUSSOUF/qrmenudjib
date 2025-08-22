import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getMenuByRestaurant = async (restaurantId: string) => {
  const MenuByRestaurant_QUERY = defineQuery(
    `*[_type == "menu" && restaurant._ref == $restaurantId] | order(createdAt desc) {
    _id,
    name,
    slug,
    description,
    image,
    status,
    isDefault,
    createdAt,
    updatedAt,
    category->{name},
    "dishCount": count(*[_type == "dish" && menu._ref == ^._id]),
    "views": count(*[_type == "view" && menu._ref == ^._id])
  }`
   
);

  try {
    const restaurants = await sanityFetch({ 
      query: MenuByRestaurant_QUERY ,
      params: { restaurantId },
    });
    console.log('Fetched Restaurants:', restaurants.data);
    return restaurants.data || [];
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
};
