// sanity/schemas/user.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "user",
  title: "Utilisateur",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "password",
      title: "Mot de passe",
      type: "string",
      hidden: true, // on ne le manipule jamais dans Sanity Studio
    }),
    defineField({
      name: "whatsapp",
      title: "Numéro WhatsApp",
      type: "string",
      validation: (Rule) =>
        Rule.required().regex(/^\+?[1-9]\d{1,14}$/, "Numéro invalide"),
    }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          { title: "En attente", value: "pending" },
          { title: "Actif", value: "active" },
          { title: "Désactivé", value: "disabled" },
        ],
      },
      initialValue: "pending",
    }),
    defineField({
      name: "restaurant",
      title: "Restaurant",
      type: "reference",
      to: [{ type: "restaurant" }],
      validation: (Rule) => Rule.required(),
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
  ],
});
