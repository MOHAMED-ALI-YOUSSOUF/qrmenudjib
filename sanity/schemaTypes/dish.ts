
// sanity/schemas/dish.ts
import { defineField, defineType } from "sanity";

const ALLERGENS = [
  { title: "Gluten", value: "gluten" },
  { title: "Œufs", value: "eggs" },
  { title: "Lait", value: "milk" },
  { title: "Fruits à coque", value: "nuts" },
  { title: "Poisson", value: "fish" },
  { title: "Crustacés", value: "shellfish" },
  { title: "Soja", value: "soy" },
  { title: "Céleri", value: "celery" },
  { title: "Moutarde", value: "mustard" },
  { title: "Sésame", value: "sesame" },
  { title: "Sulfites", value: "sulfites" },
  { title: "Lupin", value: "lupin" },
];

export default defineType({
  name: "dish",
  title: "Plat",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "price",
      title: "Prix (€)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "restaurant",
      title: "Restaurant",
      type: "reference",
      to: [{ type: "restaurant" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "menu",
      title: "Menu",
      type: "reference",
      to: [{ type: "menu" }],
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "allergens",
      title: "Allergènes",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: ALLERGENS,
          },
        },
      ],
    }),
    defineField({
      name: "isAvailable",
      title: "Disponible",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "isPopular",
      title: "Plat populaire",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Ordre d'affichage",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "createdAt",
      title: "Date de création",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
      },
    }),
    defineField({
      name: "updatedAt",
      title: "Dernière modification",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
      },
    }),
  ],
  orderings: [
    {
      title: "Ordre d'affichage",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
    {
      title: "Prix croissant",
      name: "priceAsc",
      by: [{ field: "price", direction: "asc" }],
    },
  ],
});