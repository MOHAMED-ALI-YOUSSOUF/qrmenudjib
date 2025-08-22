// sanity/schemas/stat.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "stat",
  title: "Statistique",
  type: "document",
  fields: [
    defineField({
      name: "restaurant",
      title: "Restaurant",
      type: "reference",
      to: [{ type: "restaurant" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "totalViews",
      title: "Vues totales",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "menuViews",
      title: "Vues de menus",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "dishViews",
      title: "Vues de plats",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "uniqueVisitors",
      title: "Visiteurs uniques",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "popularDishes",
      title: "Plats populaires",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "dish", type: "reference", to: [{ type: "dish" }] },
            { name: "views", type: "number" },
          ],
        },
      ],
    }),
  ],
});
