// sanity/schemas/view.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "view",
  title: "Vue",
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
      name: "menu",
      title: "Menu",
      type: "reference",
      to: [{ type: "menu" }],
    }),
    defineField({
      name: "dish",
      title: "Plat",
      type: "reference",
      to: [{ type: "dish" }],
    }),
    defineField({
      name: "viewType",
      title: "Type de vue",
      type: "string",
      options: {
        list: [
          { title: "Menu", value: "menu" },
          { title: "Plat", value: "dish" },
          { title: "Restaurant", value: "restaurant" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "userAgent",
      title: "User Agent",
      type: "string",
    }),
    defineField({
      name: "ipAddress",
      title: "Adresse IP",
      type: "string",
    }),
    defineField({
      name: "sessionId",
      title: "ID de session",
      type: "string",
    }),
    defineField({
      name: "viewedAt",
      title: "Date de vue",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
  ],
});