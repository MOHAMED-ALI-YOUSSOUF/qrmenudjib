// app/[slug]/page.tsx (Server Component)
import { groq } from "next-sanity";
import { client } from "@/sanity/lib/client";
import Image from "next/image";
import Link from "next/link";
import { RestaurantPage } from "@/components/menu/public-menu";

// Query pour récupérer les données du restaurant
const restaurantQuery = groq`
  *[_type == "restaurant" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    logo,
    coverImage,
    whatsapp,
    instagram,
    facebook,
    tiktok,
    adresse,
    primaryColor,
    secondaryColor,
    accentColor,
    fontFamily,
    status,
    "categories": *[_type == "category" && references(^._id) && isActive == true] | order(order asc) {
      _id,
      name,
      slug,
      description,
      image,
      "dishes": *[_type == "dish" && references(^._id) && isAvailable == true] | order(name asc) {
        _id,
        name,
        description,
        price,
        image,
        allergens
      }
    }
  }
`;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const { slug } = params;
  
  const restaurant = await client.fetch(restaurantQuery, { slug });
  
  if (!restaurant || restaurant.status !== "active") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Restaurant non trouvé ou non actif</h1>
      </div>
    );
  }

  return <RestaurantPage restaurant={restaurant} />;
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  const { slug } = params;
  
  const restaurant = await client.fetch(restaurantQuery, { slug });
  
  return {
    title: restaurant?.name || "Restaurant",
    description: restaurant?.description || "Découvrez notre menu",
  };
}