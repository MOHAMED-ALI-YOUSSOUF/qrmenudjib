// lib/sanity/queries.ts
import { defineQuery } from "next-sanity";
import { client } from "./client";
import { sanityFetch } from "./live";

// ==================== RESTAURANT QUERIES ====================

export const getRestaurantByOwner = async (ownerId: string) => {
  const query = `*[_type == "restaurant" && owner._ref == $ownerId][0] {
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
    createdAt,
    owner->{_id, name, email}
  }`;
  return await client.fetch(query, { ownerId });
};

export const getRestaurantBySlug = async (slug: string) => {
  const query = `*[_type == "restaurant" && slug.current == $slug][0] {
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
    createdAt
  }`;
  return await client.fetch(query, { slug });
};

// ==================== MENU QUERIES ====================

export const getMenusByRestaurants = async (restaurantId: string) => {
  const query = `*[_type == "menu" && restaurant._ref == $restaurantId] | order(createdAt desc) {
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
  }`;
  return await client.fetch(query, { restaurantId });
};
export const getMenuByRestaurant = async (restaurantId: string) => {
  const RESTAURANTS_QUERY = defineQuery(
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
      query: RESTAURANTS_QUERY,
      params: { restaurantId },
    });
    console.log('Fetched Restaurants:', restaurants.data);
    return restaurants.data || [];
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return [];
  }
};

export const getMenuById = async (menuId: string) => {
  const query = `*[_type == "menu" && _id == $menuId][0] {
    _id,
    name,
    slug,
    description,
    image,
    status,
    isDefault,
    createdAt,
    updatedAt,
    restaurant->{_id, name},
    category->{_id, name}
  }`;
  return await client.fetch(query, { menuId });
};

export const createMenu = async (menuData: any) => {
  return await client.create({
    _type: "menu",
    ...menuData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const updateMenu = async (menuId: string, updates: any) => {
  return await client.patch(menuId).set({
    ...updates,
    updatedAt: new Date().toISOString(),
  }).commit();
};

export const deleteMenu = async (menuId: string) => {
  return await client.delete(menuId);
};

// ==================== CATEGORY QUERIES ====================

export const getCategoriesByRestaurant = async (restaurantId: string) => {
  const query = `*[_type == "category" && restaurant._ref == $restaurantId && isActive == true] | order(order asc) {
    _id,
    name,
    slug,
    description,
    order,
    "dishCount": count(*[_type == "dish" && category._ref == ^._id])
  }`;
  return await client.fetch(query, { restaurantId });
};

export const createCategory = async (categoryData: any) => {
  return await client.create({
    _type: "category",
    ...categoryData,
    createdAt: new Date().toISOString(),
  });
};

export const updateCategory = async (categoryId: string, updates: any) => {
  return await client.patch(categoryId).set(updates).commit();
};

export const deleteCategory = async (categoryId: string) => {
  return await client.delete(categoryId);
};

// ==================== DISH QUERIES ====================

export const getDishesByRestaurant = async (restaurantId: string) => {
  const query = `*[_type == "dish" && restaurant._ref == $restaurantId] | order(order asc) {
    _id,
    name,
    slug,
    description,
    price,
    image,
    allergens,
    isAvailable,
    isPopular,
    order,
    createdAt,
    updatedAt,
    category->{_id, name},
    menu->{_id, name}
  }`;
  return await client.fetch(query, { restaurantId });
};

export const getDishesByCategory = async (categoryId: string) => {
  const query = `*[_type == "dish" && category._ref == $categoryId && isAvailable == true] | order(order asc) {
    _id,
    name,
    slug,
    description,
    price,
    image,
    allergens,
    isPopular,
    order
  }`;
  return await client.fetch(query, { categoryId });
};

export const getDishesByMenu = async (menuId: string) => {
  const query = `*[_type == "dish" && menu._ref == $menuId && isAvailable == true] | order(category->order asc, order asc) {
    _id,
    name,
    slug,
    description,
    price,
    image,
    allergens,
    isPopular,
    order,
    category->{_id, name, order}
  }`;
  return await client.fetch(query, { menuId });
};

export const getDishById = async (dishId: string) => {
  const query = `*[_type == "dish" && _id == $dishId][0] {
    _id,
    name,
    slug,
    description,
    price,
    image,
    allergens,
    isAvailable,
    isPopular,
    order,
    createdAt,
    updatedAt,
    restaurant->{_id, name},
    category->{_id, name},
    menu->{_id, name}
  }`;
  return await client.fetch(query, { dishId });
};

export const createDish = async (dishData: any) => {
  return await client.create({
    _type: "dish",
    ...dishData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const updateDish = async (dishId: string, updates: any) => {
  return await client.patch(dishId).set({
    ...updates,
    updatedAt: new Date().toISOString(),
  }).commit();
};

export const deleteDish = async (dishId: string) => {
  return await client.delete(dishId);
};

export const toggleDishAvailability = async (dishId: string, isAvailable: boolean) => {
  return await client.patch(dishId).set({
    isAvailable,
    updatedAt: new Date().toISOString(),
  }).commit();
};

// ==================== VIEW QUERIES ====================

export const createView = async (viewData: {
  restaurant: string;
  menu?: string;
  dish?: string;
  viewType: "menu" | "dish" | "restaurant";
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
}) => {
  return await client.create({
    _type: "view",
    ...viewData,
    viewedAt: new Date().toISOString(),
  });
};

export const getViewsByRestaurant = async (restaurantId: string, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const query = `*[_type == "view" && restaurant._ref == $restaurantId && viewedAt >= $startDate] {
    _id,
    viewType,
    viewedAt,
    menu->{name},
    dish->{name}
  }`;
  return await client.fetch(query, { 
    restaurantId, 
    startDate: startDate.toISOString() 
  });
};

export const getPopularDishes = async (restaurantId: string, limit = 10) => {
  const query = `*[_type == "view" && restaurant._ref == $restaurantId && viewType == "dish"] {
    "dishId": dish._ref,
    dish->{_id, name, price, image}
  } | {
    "dish": dish,
    "views": count(*)
  } | order(views desc) [0...$limit]`;
  
  return await client.fetch(query, { restaurantId, limit: limit - 1 });
};

// ==================== STATS QUERIES ====================

export const getOrCreateDailyStat = async (restaurantId: string, date: string) => {
  // Vérifier si les stats existent pour cette date
  const existingStat = await client.fetch(
    `*[_type == "stat" && restaurant._ref == $restaurantId && date == $date][0]`,
    { restaurantId, date }
  );
  
  if (existingStat) {
    return existingStat;
  }
  
  // Créer de nouvelles stats
  return await client.create({
    _type: "stat",
    restaurant: { _type: "reference", _ref: restaurantId },
    date,
    totalViews: 0,
    menuViews: 0,
    dishViews: 0,
    uniqueVisitors: 0,
    popularDishes: [],
  });
};

export const updateDailyStat = async (statId: string, updates: any) => {
  return await client.patch(statId).set(updates).commit();
};

export const getRestaurantStats = async (restaurantId: string, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startDateString = startDate.toISOString().split('T')[0];
  
  const query = `*[_type == "stat" && restaurant._ref == $restaurantId && date >= $startDate] | order(date desc) {
    _id,
    date,
    totalViews,
    menuViews,
    dishViews,
    uniqueVisitors,
    popularDishes
  }`;
  
  return await client.fetch(query, { restaurantId, startDate: startDateString });
};

// ==================== HELPER FUNCTIONS ====================

export const getRestaurantDashboardData = async (restaurantId: string) => {
  const [restaurant, menus, dishes, categories, recentViews, stats] = await Promise.all([
    client.fetch(`*[_type == "restaurant" && _id == $restaurantId][0]`, { restaurantId }),
    getMenusByRestaurant(restaurantId),
    getDishesByRestaurant(restaurantId),
    getCategoriesByRestaurant(restaurantId),
    getViewsByRestaurant(restaurantId, 7),
    getRestaurantStats(restaurantId, 30),
  ]);
  
  return {
    restaurant,
    menus,
    dishes,
    categories,
    recentViews,
    stats,
  };
};