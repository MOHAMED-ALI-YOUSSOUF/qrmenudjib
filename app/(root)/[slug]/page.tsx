import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import RestaurantClient from '@/components/RestaurantClient';

// Types
interface Restaurant {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  logo?: any;
  coverImage?: any;
  whatsapp?: string;
  adresse?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  status: string;
  pendingReason?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  order: number;
}

interface Dish {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  price: number;
  image?: any;
  allergens?: string[];
  isPopular?: boolean;
  category: {
    _id: string;
    slug: { current: string };
  };
}

interface GroupedCategory {
  _id: string;
  name: string;
  slug: { current: string };
  description?: string;
  order: number;
  dishes: Dish[];
}

// Queries Sanity
const restaurantQuery = `
  *[_type == "restaurant" && slug.current == $slug && status == "active"][0] {
    _id,
    name,
    slug,
    description,
    logo,
    coverImage,
    whatsapp,
    adresse,
    instagram,
    facebook,
    tiktok,
    primaryColor,
    secondaryColor,
    accentColor,
    fontFamily,
    status,
    pendingReason
  }
`;

const categoriesQuery = `
  *[_type == "category" && restaurant._ref == $restaurantId && isActive == true] | order(order asc) {
    _id,
    name,
    slug,
    description,
    order
  }
`;

const dishesQuery = `
  *[_type == "dish" && restaurant._ref == $restaurantId && isAvailable == true] | order(order asc) {
    _id,
    name,
    slug,
    description,
    price,
    image,
    allergens,
    isPopular,
    category->{
      _id,
      slug
    }
  }
`;

// Fetch restaurant data
async function getRestaurantData(slug: string) {
  console.log('🔍 Fetching restaurant with slug:', slug);

  const restaurant = await client.fetch(restaurantQuery, { slug });
  console.log('🏪 Restaurant found:', restaurant?.name);

  if (!restaurant) {
    return null;
  }

  const [categories, dishes] = await Promise.all([
    client.fetch(categoriesQuery, { restaurantId: restaurant._id }),
    client.fetch(dishesQuery, { restaurantId: restaurant._id }),
  ]);

  console.log('📋 Categories fetched:', categories.length, categories.map((c: Category) => c.name));
  console.log('🍽️ Dishes fetched:', dishes.length, dishes.map((d: Dish) => `${d.name} (${d.category?.slug?.current})`));

  return {
    restaurant,
    categories,
    dishes,
  };
}

// Group dishes by category
function groupDishesByCategory(dishes: Dish[], categories: Category[]): GroupedCategory[] {
  console.log('🔍 Debug - Categories:', categories.length);
  console.log('🔍 Debug - Dishes:', dishes.length);

  const grouped = categories.map((category) => {
    const categoryDishes = dishes.filter((dish) => {
      const matches = dish.category?.slug?.current === category.slug.current;
      console.log(`📋 Category "${category.name}" - Dish "${dish.name}" matches:`, matches);
      return matches;
    });

    console.log(`📊 Category "${category.name}" has ${categoryDishes.length} dishes`);

    return {
      ...category,
      dishes: categoryDishes,
    };
  });

  console.log('✅ Returning all categories (including empty ones)');
  return grouped;
}

// Server Component
export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getRestaurantData(slug);

  if (!data) {
    notFound();
  }

  const { restaurant, categories, dishes } = data;
  const groupedDishes = groupDishesByCategory(dishes, categories);

  return (
    <RestaurantClient restaurant={restaurant} groupedDishes={groupedDishes} />
  );
}

// Metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getRestaurantData(slug);

  if (!data) {
    return {
      title: 'Restaurant non trouvé',
    };
  }

  const { restaurant } = data;

  return {
    title: `${restaurant.name} - Menu Digital`,
    description: restaurant.description || `Découvrez le menu de ${restaurant.name}`,
    openGraph: {
      title: restaurant.name,
      description: restaurant.description || `Menu digital de ${restaurant.name}`,
      images: restaurant.coverImage
        ? [urlFor(restaurant.coverImage).width(1200).height(630).url()]
        : undefined,
    },
  };
}